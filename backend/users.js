const express = require("express");
const mongoose = require("mongoose");
const User = require("./user.model");
const router = express.Router();
const { checkToken } = require("./middlewares");

router.get("/", checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Error retrieving user data");
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car details", error });
  }
});

module.exports = router;
