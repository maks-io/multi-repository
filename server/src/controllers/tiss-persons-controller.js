const axios = require("axios");

const baseUrl = "https://tiss.tuwien.ac.at";
const searchPersonsUrl = `${baseUrl}/api/person/v22/psuche`;

exports.searchTissPersons = async (req, res) => {
  const { searchterm } = req.params;

  console.log("[TISS - PERSON]", "search", searchterm, "...start");

  const url = searchPersonsUrl;
  try {
    const result = await axios.get(url, { params: { q: searchterm } });
    const persons = result.data.results;

    console.log("[TISS - PERSON]", "search", searchterm, "...done");
    return res.json(persons);
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};

const searchUserByIdUrl = personId =>
  `${baseUrl}/api/person/v22/id/${personId}`;

exports.getUserById = async (userId, group) => {
  console.log("[TISS - PERSON]", "get by id", userId, "...start");

  const url = searchUserByIdUrl(userId);
  try {
    const result = await axios.get(url);

    console.log("[TISS - PERSON]", "get by id", userId, "...done");
    return {
      platform: "TISS",
      type: "PERSON",
      resource: { ...result.data, group }
    };
  } catch (err) {
    console.log("err!", err);
    return null;
  }
};
