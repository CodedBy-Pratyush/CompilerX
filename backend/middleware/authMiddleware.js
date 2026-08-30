const { verifyToken, COOKIE_NAME } = require("../utils/token");

function authMiddleware(req, res, next) {
  try {
    // Mobile browsers (iOS Safari ITP, in-app webviews, Chrome mobile with
    // strict cross-site cookie blocking) frequently refuse to store/send the
    // cross-domain SameSite=None cookie (frontend on Vercel, backend on
    // Render). Fall back to a Bearer token sent via the Authorization
    // header, which isn't subject to third-party cookie blocking.
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;
    const token = req.cookies?.[COOKIE_NAME] || bearer;

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
