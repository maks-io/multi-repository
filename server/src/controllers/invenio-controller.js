const axios = require("axios");

const getSearchProjectsUrl = searchTerm =>
  `https://zenodo.org/api/records/?page=1&size=20&q=${searchTerm}`;

exports.searchProjects = async (req, res) => {
  const { searchterm } = req.params;

  const searchTerm = encodeURI(encodeURI(searchterm));

  console.log("[INVENIO - PROJECT]", "search", searchTerm, "...start");

  const url = getSearchProjectsUrl(searchTerm);
  try {
    const result = await axios.get(url);

    const projects = result.data;

    console.log("[INVENIO - PROJECT]", "search", searchTerm, "...done");

    return res.json(projects);
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};

const getProjectByIdUrl = projectId =>
  `https://zenodo.org/api/records/${projectId}`;

exports.getProjectById = async (projectId, group) => {
  console.log("[INVENIO - PROJECT]", "get by id", projectId, "...start");

  const url = getProjectByIdUrl(projectId);
  try {
    const result = await axios.get(url);

    console.log("[INVENIO - PROJECT]", "get by id", projectId, "...done");
    const resource = { ...result.data, group };

    return {
      platform: "INVENIO",
      type: "PROJECT",
      resource
    };
  } catch (err) {
    //  console.log("err!");
    console.log("err!", err);
    res.sendStatus(500);
  }
};
