const { z } = require("zod");
const { SUPPORTED_LANGUAGES } = require("../utils/languages");

const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  projLanguage: z.enum(SUPPORTED_LANGUAGES, {
    errorMap: () => ({ message: "Unsupported language" }),
  }),
});

const saveProjectSchema = z.object({
  projectId: z.string().trim().min(1, "projectId is required"),
  code: z.string().default(""),
});

const projectIdSchema = z.object({
  projectId: z.string().trim().min(1, "projectId is required"),
});

const editProjectSchema = z.object({
  projectId: z.string().trim().min(1, "projectId is required"),
  name: z.string().trim().min(1, "Project name is required"),
});

module.exports = {
  createProjectSchema,
  saveProjectSchema,
  projectIdSchema,
  editProjectSchema,
};
