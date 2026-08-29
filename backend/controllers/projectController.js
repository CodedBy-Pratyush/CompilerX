const projectModel = require("../models/projectModel");
const { getDefaultCode } = require("../utils/languages");

async function findOwnedProject(projectId, userId) {
  const project = await projectModel.findById(projectId);

  if (!project) {
    return { error: { status: 404, msg: "Project not found" } };
  }

  if (project.createdBy.toString() !== userId) {
    return {
      error: {
        status: 403,
        msg: "You do not have access to this project",
      },
    };
  }

  return { project };
}

function sendError(res, error) {
  return res.status(error.status).json({ success: false, msg: error.msg });
}

exports.createProject = async (req, res) => {
  try {
    const { name, projLanguage } = req.body;

    const project = await projectModel.create({
      name,
      projLanguage,
      createdBy: req.user.id,
      code: getDefaultCode(projLanguage),
    });

    res.status(200).json({
      success: true,
      msg: "Project created successfully",
      projectId: project._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.saveProject = async (req, res) => {
  try {
    const { projectId, code } = req.body;
    const result = await findOwnedProject(projectId, req.user.id);

    if (result.error) return sendError(res, result.error);

    result.project.code = code;
    await result.project.save();

    res.status(200).json({
      success: true,
      msg: "Project saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await projectModel
      .find({ createdBy: req.user.id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      msg: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const result = await findOwnedProject(req.body.projectId, req.user.id);

    if (result.error) return sendError(res, result.error);

    res.status(200).json({
      success: true,
      msg: "Project fetched successfully",
      project: result.project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const result = await findOwnedProject(req.body.projectId, req.user.id);

    if (result.error) return sendError(res, result.error);

    await result.project.deleteOne();

    res.status(200).json({
      success: true,
      msg: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.editProject = async (req, res) => {
  try {
    const { projectId, name } = req.body;
    const result = await findOwnedProject(projectId, req.user.id);

    if (result.error) return sendError(res, result.error);

    result.project.name = name;
    await result.project.save();

    res.status(200).json({
      success: true,
      msg: "Project edited successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports.findOwnedProject = findOwnedProject;
