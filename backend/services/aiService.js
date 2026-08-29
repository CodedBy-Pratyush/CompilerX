const DEFAULT_PROVIDER = process.env.AI_PROVIDER || "gemini";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

// Create prompt
function createPrompt(code, prompt) {
  return `
You are a coding assistant.

User request:
${prompt}

Code:
\`\`\`
${code}
\`\`\`

Fix or update the code according to the request.

Return the complete updated code first.
Then give a short explanation of what you changed.
`;
}

// Gemini
async function callGemini(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini API error");
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Groq
async function callGroq(prompt) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Groq API error");
  }

  return data?.choices?.[0]?.message?.content || "";
}

// Main function
async function fixCodeWithAI({ code, prompt, provider }) {
  const selectedProvider = (provider || DEFAULT_PROVIDER).toLowerCase();

  const aiPrompt = createPrompt(code, prompt);

  let result;

  if (selectedProvider === "gemini") {
    result = await callGemini(aiPrompt);
  } else if (selectedProvider === "groq") {
    result = await callGroq(aiPrompt);
  } else {
    throw new Error("Invalid AI provider. Use gemini or groq.");
  }

  if (!result) {
    throw new Error("AI returned no response");
  }

  return {
    provider: selectedProvider,
    result,
  };
}

module.exports = {
  fixCodeWithAI,
};
