const rateLimit = require("express-rate-limit");


const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, msg: "Too many attempts. Please try again in a minute." },
});

const executionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, type: "api_error", output: "Too many execution requests. Please slow down." },
});


const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, msg: "Too many AI requests. Please slow down." },
});

module.exports = { authLimiter, executionLimiter, aiLimiter };
