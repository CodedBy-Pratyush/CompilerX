const express = require("express");
const router = express.Router();

const { signUp, login, logout, me } = require("../controllers/authController");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const { signUpSchema, loginSchema } = require("../validators/authValidators");

router.post("/signUp", authLimiter, validate(signUpSchema), signUp);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

module.exports = router;
