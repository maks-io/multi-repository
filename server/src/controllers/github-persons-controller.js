const axios = require("axios");

const restUrl = "https://api.github.com";

const getSearchUrl = searchTerm => `${restUrl}/search/users?q=${searchTerm}`;

exports.searchGithubPersons = async (req, res) => {
  const { searchterm } = req.params;

  console.log("[GITHUB - PERSON]", "search", searchterm, "...start");

  const url = getSearchUrl(encodeURI(searchterm));
  try {
    const result = await axios.get(url);
    const persons = result.data.items;

    console.log("[GITHUB - PERSON]", "search", searchterm, "...done");
    return res.json(persons);
  } catch (err) {
    console.log("err!", err);
    res.sendStatus(500);
  }
};

const getUserIdUrl = userId => `${restUrl}/users/${userId}`;

exports.getUserById = async (userId, group) => {
  console.log("[GITHUB - USER]", "get by id", userId, "...start");

  const url = getUserIdUrl(userId);
  try {
    const result = await axios.get(url);

    console.log("[GITHUB - USER]", "get by id", userId, "...done");
    return {
      platform: "GITHUB",
      type: "USER",
      resource: { ...result.data, group }
    };
  } catch (err) {
    console.log("err!", err);
    return null;
  }
};
