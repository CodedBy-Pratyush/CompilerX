const { fixCodeWithAI } = require("../services/aiService");


exports.fixWithAI = async (req, res) => {
  try {
    const { code, prompt, provider } = req.body;

    const { result } = await fixCodeWithAI({ code, prompt, provider });

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message || "AI request failed." });
  }
};
