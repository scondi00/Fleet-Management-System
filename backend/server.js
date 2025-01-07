const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRequestsRouter = require("./user-requests");
const carsRouter = require("./cars");
const { checkToken } = require("./middlewares");

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
  console.error("Error with connection:", error);
});
db.once("open", function () {
  console.log("Connected to MongoDb");
});

app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.use("/user-requests", userRequestsRouter);
app.use("/cars", carsRouter);
app.get("/user", checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Error retrieving user data");
  }
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
        { id: userDb.id, role: userDb.role },
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
