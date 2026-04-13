const express = require("express");
const router = express.Router();

const protect = require("../middleware/authmiddleware");

const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

router.route("/")
  .post(protect, createJob)
  .get(protect, getJobs);

router.route("/:id")
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;