const axios = require("axios");

const baseUrl = "https://tiss.tuwien.ac.at";
const searchProjectsURL = `${baseUrl}/api/pdb/rest/projectFullSearch/v1`;

exports.searchTissProjects = async (req, res) => {
  const { searchterm } = req.params;

  console.log("[TISS - PROJECT]", "search", searchterm, "...start");

  const url = searchProjectsURL;
  try {
    const result = await axios.get(url, { params: { searchText: searchterm } });
    const projects = result.data.project;

    console.log("[TISS - PROJECT]", "search", searchterm, "...done");
    return res.json(projects);
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};

const getProjectByIdURL = projectId =>
  `${baseUrl}/api/pdb/rest/project/v2/${projectId}`;

exports.getProjectById = async (projectId, group) => {
  console.log("[TISS - PROJECT]", "get by id", projectId, "...start");

  const url = getProjectByIdURL(projectId);
  try {
    const result = await axios.get(url);

    console.log("[TISS - PROJECT]", "get by id", projectId, "...done");
    return {
      platform: "TISS",
      type: "PROJECT",
      resource: { ...result.data.project, group }
    };
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};
