const express = require("express");
const router = express.Router();

const protect = require("../middleware/authmiddleware");
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobStats,
} = require("../controllers/jobController");

router.get("/stats", protect, getJobStats);

router.route("/")
  .post(protect, createJob)
  .get(protect, getJobs);

router.route("/:id")
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;