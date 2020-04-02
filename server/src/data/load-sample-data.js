const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

const DB_URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_NAME}`;

console.log("DB_URL", DB_URL);

mongoose.connect(DB_URL);

const Link = require("../models/Link");

async function deleteData() {
  console.log("Deleting data...");
  await Link.remove();
  console.log("...done!");
  process.exit();
}

async function loadData() {
  const sampleLinks = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/links.json"), "utf-8")
  );

  const links = sampleLinks;

  try {
    await Link.insertMany(links);
    console.log("...done!");
    process.exit();
  } catch (e) {
    console.log("...error!", e.message);
    process.exit();
  }
}

if (process.argv.includes("--delete")) {
  deleteData();
} else {
  loadData();
}
