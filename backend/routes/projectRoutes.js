const express = require("express");
const router = express.Router();

const {
  createProject,
  saveProject,
  getProjects,
  getProject,
  deleteProject,
  editProject,
} = require("../controllers/projectController");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createProjectSchema,
  saveProjectSchema,
  projectIdSchema,
  editProjectSchema,
} = require("../validators/projectValidators");

// Every route here requires a logged-in user, and every controller re-checks
// that the project actually belongs to req.user.id.
router.use(authMiddleware);

router.post("/createProj", validate(createProjectSchema), createProject);
router.post("/saveProject", validate(saveProjectSchema), saveProject);
router.post("/getProjects", getProjects);
router.post("/getProject", validate(projectIdSchema), getProject);
router.post("/deleteProject", validate(projectIdSchema), deleteProject);
router.post("/editProject", validate(editProjectSchema), editProject);

module.exports = router;
