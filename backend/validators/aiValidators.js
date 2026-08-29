const { z } = require("zod");

const fixWithAISchema = z.object({
  code: z.string().trim().min(1, "Please paste some code first."),
  prompt: z.string().trim().min(1, "Please tell the AI what to fix."),
  provider: z.enum(["groq", "gemini"]).optional(),
});

module.exports = { fixWithAISchema };
