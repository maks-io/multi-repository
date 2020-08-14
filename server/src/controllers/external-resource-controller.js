const axios = require("axios");
const _ = require("lodash");
const dotenv = require("dotenv");
dotenv.config();
const { externalApiConfig } = require("../external-apis");
const { createIdentifier } = require("../services/create-identifier");

/*
 * Returns an array of available platforms/type combinations,
 * as defined in ../external-apis.js
 *
 * Example result:
 * [ { platform: "GITHUB", type: "PROJECT" } ]
 *
 * Gets called by server.
 */
const getExternalResources = () => {
  const platforms = Object.keys(externalApiConfig);
  const externalResources = [];
  platforms.forEach(platform => {
    const types = Object.keys(externalApiConfig[platform]);
    types.forEach(type => {
      externalResources.push({
        platform,
        type,
        logoUrl: externalApiConfig[platform][type].LOGO_URL,
        fallbackAvatar: externalApiConfig[platform][type].FALLBACK_AVATAR
      });
    });
  });
  return externalResources;
};

/*
 * Same as above, but
 * gets called by client.
 */
const _getExternalResources = async (req, res) => {
  const externalResources = getExternalResources();
  res.json(externalResources);
};

/*
 * Search external resource for 0 to n objects - via searchBothSteps term.
 *
 * Gets called by client.
 */
const searchByTerm = async (req, res) => {
  const { platform, type, searchTerm } = req.params;

  const config = externalApiConfig[platform][type].SEARCH_BY_TERM;

  let preparedSearchTerm = encodeURI(searchTerm);

  const encodingLevel = config.QUERY.ENCODING_LEVEL;
  if (encodingLevel) {
    for (let i = 1; i < encodingLevel; ++i) {
      preparedSearchTerm = encodeURI(preparedSearchTerm);
    }
  }

  const urlForSearchByTerm = config.QUERY.URL;
  const token = process.env[`TOKEN_${platform}_${type}`];
  const preparedUrl = urlForSearchByTerm
    .replace("[SEARCH_TERM]", preparedSearchTerm)
    .replace("[TOKEN]", token);

  const consoleMessage = `[${platform} - ${type}] search for '${searchTerm}' via ${preparedUrl}`;

  console.log(consoleMessage, "\n\t", "...start");

  try {
    const rawResult = await axios.get(preparedUrl);

    const { PATH, TRANSFORM_FUNCTION } = config.RESULT;
    const result = !PATH ? rawResult.data : _.get(rawResult.data, PATH, []);

    const transformedResult = TRANSFORM_FUNCTION
      ? result.map(TRANSFORM_FUNCTION)
      : result;

    // if (platform === "TISS" && type === "PROJECT") {
    //   console.log("***********************", preparedUrl);
    // }

    const idPath =
      externalApiConfig[platform][type]["SEARCH_BY_TERM"].RESULT.STRUCTURE.id;
    const resultsWithIdentifiers = transformedResult.map(o => ({
      ...o,
      identifier: createIdentifier(platform, type, _.get(o, idPath))
    }));

    console.log(consoleMessage, "\n\t", "...done");

    const data = {
      platform,
      type,
      results: resultsWithIdentifiers,
      resultStructure: config.RESULT.STRUCTURE
    };
    res.json(data);
  } catch (error) {
    console.error(consoleMessage, "\n\t", "...error:", error);
    res.sendStatus(500);
  }
};

/*
 * Search external resource for exactly 1 object - via id.
 *
 * Gets called by server.
 */
const getById = async (platform, type, id, groupId) => {
  const config = externalApiConfig[platform][type].GET_BY_ID;

  const urlForGetById = config.QUERY.URL;
  const token = process.env[`TOKEN_${platform}_${type}`];
  const preparedUrl = urlForGetById
    .replace("[ID]", id)
    .replace("[TOKEN]", token);

  const consoleMessage = `[${platform} - ${type}] get by id '${id}' via ${preparedUrl}`;

  console.log(consoleMessage, "\n\t", "...start");

  try {
    const rawResult = await axios.get(preparedUrl);

    const { PATH, TRANSFORM_FUNCTION } = config.RESULT;
    const result = !PATH ? rawResult.data : _.get(rawResult.data, PATH, {});

    const transformedResult = TRANSFORM_FUNCTION
      ? TRANSFORM_FUNCTION(result)
      : result;

    if (platform === "TISS" && type === "PROJECT") {
      console.log("***********************", result);
    }

    const idPath =
      externalApiConfig[platform][type]["SEARCH_BY_TERM"].RESULT.STRUCTURE.id;
    const resultWithIdentifier = {
      ...transformedResult,
      identifier: createIdentifier(
        platform,
        type,
        _.get(transformedResult, idPath)
      )
    };

    console.log(consoleMessage, "\n\t", "...done");

    const data = {
      platform,
      type,
      ...resultWithIdentifier,
      resultStructure: config.RESULT.STRUCTURE,
      isNew: true,
      isPartOf: [groupId]
    };

    return data;
  } catch (error) {
    console.error(consoleMessage, "\n\t", "...error:", error);
    return null;
  }
};

module.exports = {
  getExternalResources,
  _getExternalResources,
  searchByTerm,
  getById
};
