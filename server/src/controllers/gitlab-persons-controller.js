const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();


const baseUrl = "https://gitlab.com";
const apiVersionString = "api/v4";

const restUrl = `${baseUrl}/${apiVersionString}/`;
const personalAccessToken = process.env.GITLAB_TOKEN;

const getSearchUrl = (scope, searchTerm) =>
  `${restUrl}/search?private_token=${personalAccessToken}&scope=${scope}&search=${searchTerm}`;

exports.searchGitlabPersons = async (req, res) => {
  const { searchterm } = req.params;

  console.log("[GITLAB - PERSON]", "search", searchterm, "...start");

  const url = getSearchUrl("users", encodeURI(searchterm));
  try {
    const result = await axios.get(url);
    const projects = result.data;

    console.log("[GITLAB - PERSON]", "search", searchterm, "...done");
    return res.json(projects);
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};

const getUserIdUrl = userId => `${restUrl}/users/${userId}`;

exports.getUserById = async (userId, group) => {
  console.log("[GITLAB]", "get by id", userId, "...start");

  const url = getUserIdUrl(userId);
  try {
    const result = await axios.get(url);

    console.log("[GITLAB]", "get by id", userId, "...done");
    return {
      platform: "GITLAB",
      type: "PERSON",
      resource: { ...result.data, group }
    };
  } catch (err) {
    //  console.log("err!");
    console.log("err!", err);
    return null;
  }
};
