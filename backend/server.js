const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Pozdrav od Express poslužitelja!");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server sluša zahtjeve na portu ${PORT}`);
});
