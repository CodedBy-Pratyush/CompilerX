const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "token";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Add it to backend/.env");
}

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  if (isProduction) {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "none";
  } else {
    cookieOptions.sameSite = "lax";
  }

  res.cookie(COOKIE_NAME, token, cookieOptions);
}

function clearAuthCookie(res) {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
  };

  if (isProduction) {
    cookieOptions.secure = true;
    cookieOptions.sameSite = "none";
  } else {
    cookieOptions.sameSite = "lax";
  }

  res.clearCookie(COOKIE_NAME, cookieOptions);
}

module.exports = {
  COOKIE_NAME,
  signToken,
  verifyToken,
  setAuthCookie,
  clearAuthCookie,
};
