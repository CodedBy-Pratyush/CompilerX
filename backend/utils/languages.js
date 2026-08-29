const LANGUAGES = {
  javascript: {
    label: "JavaScript",
    extension: ".js",
    defaultCode: 'console.log("Hello World");',
  },

  python: {
    label: "Python",
    extension: ".py",
    defaultCode: 'print("Hello World")',
  },

  java: {
    label: "Java",
    extension: ".java",
    defaultCode: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`,
  },

  c: {
    label: "C",
    extension: ".c",
    defaultCode: `#include <stdio.h>

int main() {
  printf("Hello World\\n");
  return 0;
}`,
  },

  cpp: {
    label: "C++",
    extension: ".cpp",
    defaultCode: `#include <iostream>

int main() {
  std::cout << "Hello World" << std::endl;
  return 0;
}`,
  },
};

const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES);

function isSupportedLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language);
}

function getDefaultCode(language) {
  return LANGUAGES[language]?.defaultCode || "";
}

function getLanguageConfig(language) {
  return LANGUAGES[language];
}

module.exports = {
  LANGUAGES,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  getDefaultCode,
  getLanguageConfig,
};
