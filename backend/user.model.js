const mongoose = require("mongoose");
const { Schema } = mongoose;

const userShema = new Schema({
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User = mongoose.model("User", userShema, "users");

module.exports = User;
