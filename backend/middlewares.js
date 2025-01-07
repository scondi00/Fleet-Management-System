const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).send("No authorization header");

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).send("Bearer token missing");

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
  return next();
};

module.exports = { checkToken };
