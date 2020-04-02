const axios = require("axios");

const restUrl = "https://api.github.com";

const getSearchUrl = searchTerm =>
  `${restUrl}/search/repositories?q=${searchTerm}`;

exports.searchProjects = async (req, res) => {
  const { searchterm } = req.params;

  console.log("[GITHUB - PROJECT]", "search", searchterm, "...start");

  const url = getSearchUrl(encodeURI(searchterm));
  try {
    const result = await axios.get(url);
    const projects = result.data.items;

    console.log("[GITHUB - PROJECT]", "search", searchterm, "...done");
    return res.json(projects);
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};

const getProjectIdUrl = projectId => `${restUrl}/repositories/${projectId}`;

exports.getProjectById = async (projectId, group) => {
  console.log("[GITHUB - PROJECT]", "get by id", projectId, "...start");

  const url = getProjectIdUrl(projectId);
  try {
    const result = await axios.get(url);

    console.log("[GITHUB - PROJECT]", "get by id", projectId, "...done");

    return {
      platform: "GITHUB",
      type: "PROJECT",
      resource: { ...result.data, group }
    };
  } catch (err) {
    console.log("err!", err);
    return null;
  }
};
