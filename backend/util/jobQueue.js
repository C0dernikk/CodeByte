const Queue = require("bull");

const Job = require("../models/Job");

const { executeC, executeCpp } = require("../compiler/executeCAndCpp");
const executeJS = require("../compiler/executeJS");
const executeJava = require("../compiler/executeJava");
const executePy = require("../compiler/executePy");

const deleteFile = require("../util/deleteFile");

const NUM_OF_WORKERS = 5;

// Processor function: given a jobId, fetch job and execute appropriate runner.
const processJobById = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("invalid job id");
  }

  let output;
  try {
    job.startedAt = new Date();
    if (job.language === "c") {
      output = await executeC(job.filepath, job.inputpath);
    } else if (job.language === "cpp") {
      output = await executeCpp(job.filepath, job.inputpath);
    } else if (job.language === "js") {
      output = await executeJS(job.filepath);
    } else if (job.language === "java") {
      output = await executeJava(job.filepath, job.inputpath);
    } else if (job.language === "py") {
      output = await executePy(job.filepath, job.inputpath);
    }
    job.completedAt = new Date();
    job.status = "Success";
    job.output = output && output.stdout ? output.stdout : "";
  } catch (error) {
    job.completedAt = new Date();
    job.status = "Error";
    job.output =
      error && (error.stderr || error.error) ? error.stderr || error.error : "";
  }
  try {
    await job.save();
  } catch (err) {
    // ignore
  }
  deleteFile(job.filepath);
};

// If USE_REDIS is explicitly set to 'false', run jobs immediately in-process (local dev fallback).
const useRedis = !(
  process.env.USE_REDIS === "false" || process.env.USE_REDIS === "0"
);

let jobQueue;
if (useRedis) {
  jobQueue = new Queue("job-queue");
  jobQueue.process(NUM_OF_WORKERS, async ({ data }) => {
    const { id: jobId } = data;
    await processJobById(jobId);
  });

  jobQueue.on("failed", (error) => {});
}

const addJobToQueue = async (jobId) => {
  if (useRedis) {
    await jobQueue.add({ id: jobId });
  } else {
    // immediate processing for local development
    // run without waiting to simulate background worker
    processJobById(jobId).catch((err) => {
      console.error(
        "Local job processing failed:",
        err && err.message ? err.message : err
      );
    });
  }
};

module.exports = { addJobToQueue };
