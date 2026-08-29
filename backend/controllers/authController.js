const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const { signToken, setAuthCookie, clearAuthCookie } = require("../utils/token");

exports.signUp = async (req, res) => {
  try {
    const { email, pwd, fullName } = req.body;

    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, msg: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pwd, salt);

    await userModel.create({ email, password: hash, fullName });

    return res.status(200).json({ success: true, msg: "User created successfully" });
  } catch (error) {
    // FIX: log the real error server-side so production issues are visible
    // in Render logs instead of only guessable from the response body.
    console.error("signUp error:", error);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, pwd } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Invalid password" });
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      msg: "User logged in successfully",
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (error) {
    // FIX: log the real error server-side (this is how the "option sameSite
    // is invalid" root cause was found — it was only visible in error.message).
    console.error("login error:", error);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.logout = async (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ success: true, msg: "Logged out successfully" });
};

exports.me = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};
