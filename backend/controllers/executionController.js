const { findOwnedProject } = require("./projectController");
const { runCode } = require("../services/executionService");
const executionModel = require("../models/executionModel");

exports.execute = async (req, res) => {
  try {
    const { projectId, code, stdin } = req.body;

    const { project, error } = await findOwnedProject(projectId, req.user.id);
    if (error) return res.status(error.status).json({ success: false, msg: error.msg });

    const result = await runCode({
      language: project.projLanguage,
      code,
      stdin,
    });


    executionModel
      .create({
        project: project._id,
        user: req.user.id,
        language: project.projLanguage,
        code: code || "",
        input: stdin || "",
        output: result.output || "",
        status: result.type,
      })
      .catch((err) => console.error("Failed to save execution history:", err.message));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, type: "api_error", output: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { projectId } = req.body;

  
    const { error } = await findOwnedProject(projectId, req.user.id);
    if (error) return res.status(error.status).json({ success: false, msg: error.msg });

    const history = await executionModel
      .find({ project: projectId, user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ success: true, msg: "History fetched successfully", history });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};
