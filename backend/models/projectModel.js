const mongoose = require("mongoose");
const { SUPPORTED_LANGUAGES } = require("../utils/languages");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  projLanguage: {
    type: String,
    required: true,
    enum: SUPPORTED_LANGUAGES,
  },
  code: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
