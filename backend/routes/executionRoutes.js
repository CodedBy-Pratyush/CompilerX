const express = require("express");
const router = express.Router();

const { execute, getHistory } = require("../controllers/executionController");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const { executionLimiter } = require("../middleware/rateLimiter");
const { executeSchema, historySchema } = require("../validators/executionValidators");

router.use(authMiddleware);

router.post("/execute", executionLimiter, validate(executeSchema), execute);
router.post("/getExecutionHistory", validate(historySchema), getHistory);

module.exports = router;
