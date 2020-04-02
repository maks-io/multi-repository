const axios = require("axios");

const getSearchProjectsUrl = searchTerm =>
  `https://explore.openaire.eu/cache/get?url=https%3A%2F%2Fservices.openaire.eu%2Fsearch%2Fv2%2Fapi%2Fresources%3Fquery%3D%20(%20(oaftype%20exact%20result)%20and%20(resulttypeid%20exact%20publication)%20%20)%20%20and%20(%20%22${searchTerm}%22%20and%20resulthostingdatasourceid%20exact%20%22opendoar____%253A%253A84c2d4860a0fc27bcf854c444fb8b400%22%20)%26page%3D0%26size%3D10%26format%3Djson`;

exports.searchProjects = async (req, res) => {
  const { searchterm } = req.params;

  const searchTerm = encodeURI(encodeURI(searchterm));

  console.log("[REPOSITUM - PROJECT]", "search", searchTerm, "...start");

  const url = getSearchProjectsUrl(searchTerm);
  try {
    const result = await axios.get(url);
    const projects = result.data.results;

    console.log("[REPOSITUM - PROJECT]", "search", searchTerm, "...done");

    return res.json(projects);
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};

const getProjectByIdUrl = projectId =>
  `http://api.openaire.eu/search/publications?format=json&openairePublicationID=${projectId}`;

exports.getProjectById = async (projectId, group) => {
  console.log("[REPOSITUM - PROJECT]", "get by id", projectId, "...start");

  const url = getProjectByIdUrl(projectId);
  try {
    const result = await axios.get(url);

    console.log("[REPOSITUM - PROJECT]", "get by id", projectId, "...done");
    const resource = {
      result: {
        metadata: { ...result.data.response.results.result[0].metadata }
      },
      group
    };

    // The structure of results for fetching individual projects looks a little bit different
    // than the structure of results for querying by search term, therefore adapt:
    resource.result.metadata["oaf:entity"]["oaf:result"].originalId =
      resource.result.metadata["oaf:entity"]["oaf:result"].originalId["$"];

    resource.result.metadata["oaf:entity"]["oaf:result"].title.content =
      resource.result.metadata["oaf:entity"]["oaf:result"].title["$"];

    return {
      platform: "REPOSITUM",
      type: "PROJECT",
      resource
    };
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};
