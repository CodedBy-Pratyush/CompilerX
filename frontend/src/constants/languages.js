export const LANGUAGE_CONFIG = {
  javascript: { label: "JavaScript", monaco: "javascript", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" },
  python: { label: "Python", monaco: "python", logo: "https://images.ctfassets.net/em6l9zw4tzag/oVfiswjNH7DuCb7qGEBPK/b391db3a1d0d3290b96ce7f6aacb32b0/python.png" },
  java: { label: "Java", monaco: "java", logo: "https://static-00.iconduck.com/assets.00/java-icon-1511x2048-6ikx8301.png" },
  c: { label: "C", monaco: "c", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png" },
  cpp: { label: "C++", monaco: "cpp", logo: "https://upload.wikimedia.org/wikipedia/commons/3/32/C%2B%2B_logo.png" },
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_CONFIG);

export function getMonacoLanguage(projLanguage) {
  return LANGUAGE_CONFIG[projLanguage]?.monaco || "plaintext";
}

export function getLanguageLogo(projLanguage) {
  return LANGUAGE_CONFIG[projLanguage]?.logo || null;
}
