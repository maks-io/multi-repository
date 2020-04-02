const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const personalAccessToken = process.env.GITLAB_TOKEN;

const apiVersionString = "api/v4";
const baseUrl = "https://gitlab.com";
const restUrl = `${baseUrl}/${apiVersionString}/`;

const getSearchUrl = (scope, searchTerm) =>
  `${restUrl}/search?private_token=${personalAccessToken}&scope=${scope}&search=${searchTerm}`;

exports.searchProjects = async (req, res) => {
  const { searchterm } = req.params;

  console.log("[GITLAB - PROJECT]", "search", searchterm, "...start");

  const url = getSearchUrl("projects", encodeURI(searchterm));
  try {
    const result = await axios.get(url);
    const projects = result.data;

    console.log("[GITLAB - PROJECT]", "search", searchterm, "...done");
    return res.json(projects);
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};

const getProjectIdUrl = projectId => `${restUrl}/projects/${projectId}`;

exports.getProjectById = async (projectId, group) => {
  console.log("[GITLAB - PROJECT]", "get by id", projectId, "...start");

  const url = getProjectIdUrl(projectId);
  try {
    const result = await axios.get(url);

    console.log("[GITLAB - PROJECT]", "get by id", projectId, "...done");
    return {
      platform: "GITLAB",
      type: "PROJECT",
      resource: { ...result.data, group }
    };
  } catch (err) {
    console.log("err!", err);
    return null;
  }
};
