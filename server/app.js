const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const routes = require("./src/routes")

dotenv.config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

const DB_URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_NAME}`;

console.log("DB_URL", DB_URL);

mongoose.connect(DB_URL);

const app = express();
app.use(bodyParser.json()); // handle json data
app.use(bodyParser.urlencoded({ extended: true })); // handle URL-encoded data

app.use("/", routes);

app.listen(4000, () =>
  console.log("Express REST Server now running on localhost:4000/")
);
