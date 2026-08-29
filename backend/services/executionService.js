
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
const REQUEST_TIMEOUT_MS = 15000;

const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // OpenJDK
  c: 50,          // GCC
  cpp: 54,        // GCC (C++)
};

function statusToType(statusId) {
  if (statusId === 3) return "success";
  if (statusId === 5) return "timeout";
  if (statusId === 6) return "compile_error";
  if (statusId >= 7 && statusId <= 12) return "runtime_error";
  return "error";
}

function buildHeaders() {
  const headers = { "Content-Type": "application/json" };


  if (JUDGE0_API_KEY) headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
  if (JUDGE0_API_HOST) headers["X-RapidAPI-Host"] = JUDGE0_API_HOST;

  return headers;
}

async function submitToJudge0(languageId, code, stdin) {
  const url = `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      signal: controller.signal,
      body: JSON.stringify({
        source_code: code || "",
        language_id: languageId,
        stdin: stdin || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Judge0 responded with HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function runCode({ language, code, stdin }) {
  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    return { success: false, type: "error", output: "Unsupported language" };
  }

  try {
    const result = await submitToJudge0(languageId, code, stdin);
    const type = statusToType(result.status?.id);

    if (type === "success") {
      return { success: true, type: "success", output: result.stdout || "" };
    }

    if (type === "compile_error") {
      return {
        success: false,
        type,
        output: result.compile_output || "Compilation failed.",
      };
    }

    if (type === "timeout") {
      return { success: false, type, output: "Execution timed out." };
    }

    if (type === "runtime_error") {
      return {
        success: false,
        type,
        output: result.stderr || result.message || "Runtime error.",
      };
    }

    
    return {
      success: false,
      type: "error",
      output:
        result.stderr ||
        result.message ||
        result.status?.description ||
        "Something went wrong while running your code.",
    };
  } catch (error) {
    if (error.name === "AbortError") {
      return { success: false, type: "timeout", output: "Execution timed out." };
    }
    return {
      success: false,
      type: "error",
      output: "Could not reach the code execution service. Please try again.",
    };
  }
}

module.exports = { runCode };
