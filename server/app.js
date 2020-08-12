const { writeToDB } = require("./src/graphdb/graphdb-write");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const routes = require("./src/routes");
const {getAllLinks} = require("./src/graphdb/links");
const { readFromDB } = require("./src/graphdb/graphdb-read");
const {
  initGraphDBServerClient,
  GraphDB
} = require("./src/graphdb/graphdb-server-client");

dotenv.config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

const DB_URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_NAME}`;

console.log("DB_URL", DB_URL);

mongoose.connect(DB_URL);

initGraphDBServerClient();
const GDB = GraphDB();

// console.log("GDB", GDB);

const graphDbTest = async () => {
  const ids = await GDB.getRepositoryIDs();
  // console.log("ids", ids);

  console.log("try write....");
  await writeToDB("subj1", "pred1", "o1");
  await writeToDB("subj1", "pred2", "o2");
  await writeToDB("subj2", "pred3", "o3");
  await writeToDB("subj5", "pred3", "o3");
  console.log("done");

  console.log("try read....");
  // await readFromDB("subj1", "pred1", "o1");
  const allLinks = await getAllLinks()
  // console.log("all links are",allLinks)
  console.log("done");
};

graphDbTest();

const app = express();
app.use(bodyParser.json()); // handle json data
app.use(bodyParser.urlencoded({ extended: true })); // handle URL-encoded data

app.use("/", routes);

app.listen(4000, () =>
  console.log("Express REST Server now running on localhost:4000/")
);
