const mongoose = require("mongoose");


const executionSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  input: {
    type: String,
    default: "",
  },
  output: {
    type: String,
    default: "",
  },
  status: {
   
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

executionSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model("Execution", executionSchema);
