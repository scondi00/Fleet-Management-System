const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).send("There is no authorization header");

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).send("Bearer is not found");

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
  return next();
};

const { Schema } = mongoose;
const userShema = new Schema({
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

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

const User = mongoose.model("User", userShema, "users");
const UserRequest = mongoose.model(
  "UserRequest",
  UserRequestSchema,
  "user-requests"
);

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

app.get("/user", checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);

    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Error retrieving user data");
  }
});

app.post("/user-requests", checkToken, async (req, res) => {
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

app.get("/user-requests", checkToken, async (req, res) => {
  const userRequests = await UserRequest.find({ requester: req.user.id });
  res.status(200).json(userRequests);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server sluša zahtjeve na portu ${PORT}`);
});
