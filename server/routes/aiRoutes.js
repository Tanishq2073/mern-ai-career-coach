const express = require("express");
const router = express.Router();

const protect = require("../middleware/authmiddleware");
const aiController = require("../controllers/aiController");

router.post("/resume-analysis", protect, aiController.analyzeResume);
router.get("/interview-questions", protect, aiController.getInterviewSuggestions);

module.exports = router;
