const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRequestsRouter = require("./user-requests");
const issueReportsRouter = require("./issue-reports");
const carsRouter = require("./cars");
const usersRouter = require("./users");
const { checkToken } = require("./middlewares");
const User = require("./user.model");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/carParkDb", { family: 4 });

const db = mongoose.connection;

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
app.use("/issue-reports", issueReportsRouter);
app.use("/users", usersRouter);

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
