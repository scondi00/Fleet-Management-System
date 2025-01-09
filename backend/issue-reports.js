const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { Schema } = mongoose;

const IssueReportSchema = new Schema({
  carId: { type: Schema.Types.ObjectId, ref: "Car" },
  submissioner_id: { type: Schema.Types.ObjectId, ref: "Car" },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
});

const IssueReport = mongoose.model(
  "IssueReport",
  IssueReportSchema,
  "issue-reports"
);

router.post("/", async (req, res) => {
  const newReport = new IssueReport(req.body);
  try {
    await newReport.save();
    res.status(201).send("Report successfully added to database");
  } catch (error) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
