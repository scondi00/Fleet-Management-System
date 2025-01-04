const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const { Schema } = mongoose;
const userShema = new Schema({
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});
const User = mongoose.model("User", userShema, "users");

mongoose.connect("mongodb://127.0.0.1:27017/carParkDb", { family: 4 });

// Instanca konekcije na bazu
const db = mongoose.connection;

// Upravljanje događajima
db.on("error", (error) => {
  console.error("Greška pri spajanju:", error);
});
db.once("open", function () {
  console.log("Spojeni smo na MongoDB bazu");
});

app.get("/", (req, res) => {
  res.send("Pozdrav od Express poslužitelja!");
});

const saltRunde = 10;
app.post("/register", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, saltRunde);
    const newUser = new User({ ...req.body, password: hashPassword });
    await newUser.save();
    res.status(201).send("User successfully added to database");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const userDb = await User.findOne({ email: req.body.email });
    if (userDb && (await bcrypt.compare(req.body.password, userDb.password))) {
      const token = jwt.sign(
        { name: userDb.name, role: userDb.role },
        "secretkey",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).send(token);
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server sluša zahtjeve na portu ${PORT}`);
});
