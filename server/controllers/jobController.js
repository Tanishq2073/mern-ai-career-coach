const Job = require("../models/jobModel");
const { validateJobInput } = require("../utils/validators");

const createJob = async (req, res, next) => {
  try {
    const validationError = validateJobInput(req.body);
    if (validationError) {
      res.status(400);
      throw new Error(validationError);
    }

    const {
      company,
      role,
      status,
      appliedDate,
      location,
      salaryRange,
      jobLink,
      notes,
    } = req.body;

    const job = await Job.create({
      user: req.user._id,
      company,
      role,
      status,
      appliedDate,
      location,
      salaryRange,
      jobLink,
      notes,
    });

    res.status(201).json({
      status: "success",
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

const getJobs = async (req, res, next) => {
  try {
    const { status, keyword, sort = "latest", page = 1, limit = 5 } = req.query;

    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (keyword) {
      query.$or = [
        { company: { $regex: keyword, $options: "i" } },
        { role: { $regex: keyword, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "appliedDate") {
      sortOption = { appliedDate: -1 };
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.json({
      status: "success",
      message: "Jobs fetched successfully",
      data: {
        jobs,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    if (job.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this job");
    }

    job.company = req.body.company || job.company;
    job.role = req.body.role || job.role;
    job.status = req.body.status || job.status;
    job.appliedDate = req.body.appliedDate || job.appliedDate;
    job.location = req.body.location || job.location;
    job.salaryRange = req.body.salaryRange || job.salaryRange;
    job.jobLink = req.body.jobLink || job.jobLink;
    job.notes = req.body.notes || job.notes;

    const updatedJob = await job.save();

    res.json({
      status: "success",
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      res.status(404);
      throw new Error("Job not found");
    }

    if (job.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this job");
    }

    await job.deleteOne();

    res.json({
      status: "success",
      message: "Job deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const getJobStats = async (req, res, next) => {
  try {
    const jobs = await Job.find({ user: req.user._id });

    const stats = {
      totalJobs: jobs.length,
      applied: jobs.filter((j) => j.status === "Applied").length,
      interview: jobs.filter((j) => j.status === "Interview").length,
      offer: jobs.filter((j) => j.status === "Offer").length,
      rejected: jobs.filter((j) => j.status === "Rejected").length,
    };

    res.json({
      status: "success",
      message: "Job stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobStats,
};