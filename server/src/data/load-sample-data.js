const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const _ = require("lodash");

const dotenv = require("dotenv");
dotenv.config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

const DB_URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_NAME}`;

console.log("DB_URL", DB_URL);

mongoose.connect(DB_URL);

const Link = require("../models/Link");
const {createMultipleLinks} = require("../graphdb/links");
const { deleteAllLinks } = require("../graphdb/links");

async function deleteData() {
  console.log("Deleting data...");
  await deleteAllLinks();
  console.log("...done!");
  process.exit();
}

async function loadData() {
  const sampleLinks = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/links.json"), "utf-8")
  );

  const links = sampleLinks;
  console.log("linksssssss",links)

  try {
    // await Link.insertMany(links);
    await createMultipleLinks(links)
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
