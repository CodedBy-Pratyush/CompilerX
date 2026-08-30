const { verifyToken, COOKIE_NAME } = require("../utils/token");

function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ success: false, msg: "Not authenticated" });
    }

    const decoded = verifyToken(token);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, msg: "Invalid or expired session" });
  }
}

module.exports = authMiddleware;
