const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { checkToken } = require("./middlewares");

const { Schema } = mongoose;

const UserRequestSchema = new Schema({
  name: String,
  email: { type: String, required: true },
  carType: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "pending" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  requester: { type: Schema.Types.ObjectId, ref: "User" },
});
const UserRequest = mongoose.model(
  "UserRequest",
  UserRequestSchema,
  "user-requests"
);

router.post("/", checkToken, async (req, res) => {
  const id = req.user.id;
  console.log(id);

  const newRequest = new UserRequest({ ...req.body, requester: id });
  try {
    await newRequest.save();
    res.status(201).send("Request successfully added to database");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get request by id for user
router.get("/my-requests", checkToken, async (req, res) => {
  const userRequests = await UserRequest.find({ requester: req.user.id });
  res.status(200).json(userRequests);
});

// Get all requests for admin
router.get("/all-requests", async (req, res) => {
  const userRequests = await UserRequest.find({ status: "pending" }).populate();
  res.status(200).json(userRequests);
});

router.patch("/all-requests", async (req, res) => {
  try {
    const userRequest = await UserRequest.findByIdAndUpdate(req.body.req_id, {
      status: req.body.status,
    });
    if (userRequest) {
      console.log("Request successfully updated");
      res.status(200).send("Request successfully updated");
    } else {
      res.status(404).send("Request not found");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
