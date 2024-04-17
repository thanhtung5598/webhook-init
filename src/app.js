require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Routers
const indexRouter = require("./routes/webhook");

// router
const apiVersion = "/api/";

app.use(apiVersion, indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
