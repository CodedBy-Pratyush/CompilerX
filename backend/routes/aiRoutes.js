const express = require("express");
const router = express.Router();

const { fixWithAI } = require("../controllers/aiController");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const { aiLimiter } = require("../middleware/rateLimiter");
const { fixWithAISchema } = require("../validators/aiValidators");

router.use(authMiddleware);

router.post("/fixWithAI", aiLimiter, validate(fixWithAISchema), fixWithAI);

module.exports = router;
