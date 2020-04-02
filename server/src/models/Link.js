const mongoose = require("mongoose");
const moment = require("moment");
const path = require("path");

const { Schema } = mongoose;

const nodeSchema = new Schema({
  platform: String, // e.g. GITLAB
  type: String, // e.g. PERSON
  id: String
});

const linkSchema = new Schema(
  {
    nodes: [nodeSchema]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Link", linkSchema);
