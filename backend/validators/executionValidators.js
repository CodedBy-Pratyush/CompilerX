const { z } = require("zod");

const executeSchema = z.object({
  projectId: z.string().trim().min(1, "projectId is required"),
  code: z.string().default(""),
  stdin: z.string().default(""),
});

const historySchema = z.object({
  projectId: z.string().trim().min(1, "projectId is required"),
});

module.exports = { executeSchema, historySchema };
