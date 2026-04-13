const Job = require("../models/jobModel");

// CREATE JOB
const createJob = async (req, res) => {
  try {
    const { company, role } = req.body;

    const job = await Job.create({
      user: req.user._id,
      company,
      role,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL JOBS
const getJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          company: { $regex: req.query.keyword, $options: "i" },
        }
      : {};

    const status = req.query.status
      ? { status: req.query.status }
      : {};

    const jobs = await Job.find({
      user: req.user._id,
      ...keyword,
      ...status,
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE JOB
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      job.company = req.body.company || job.company;
      job.role = req.body.role || job.role;
      job.status = req.body.status || job.status;

      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE JOB
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      await job.deleteOne();
      res.json({ message: "Job removed" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};