const { createIdentifier } = require("../services/create-identifier");
const _ = require("lodash");
const randomColor = require("randomcolor");
const { getById } = require("./external-resource-controller");
const { mapResults } = require("../services/map-results");
const { processResults } = require("../services/process-results");
const Link = require("../models/Link");
const { externalApiConfig } = require("../external-apis");

exports.fetchLinks = async (req, res) => {
  const apiData = req.body;

  console.log("\n/////", "Search Step 2 - Link Logic - START", "/////\n");

  try {
    const links = await Link.find({});
    const newResources = await applyLinkLogic(apiData, links);

    console.log("\n/////", "Search Step 2 - Link Logic - DONE", "/////\n");

    return res.json(newResources);
  } catch (error) {
    console.log("\n/////", "Search Step 2 - Link Logic - ERROR", "/////\n");
    console.error(error);
    res.sendStatus(500);
  }
};

const applyLinkLogic = async (individualResults, links) => {
  const promises = [];
  const individualResultsCopy = processResults(
    individualResults,
    (item, platform, type, processedResults) => {
      processedResults[platform][type].push({ ...item, isOld: true });
    }
  );

  links.forEach(link => {
    const linkColor = randomColor(); // TODO temporarily using random color as link identifier

    const linkNodeOnePlatform = link.nodes[0].platform;
    const linkNodeOneType = link.nodes[0].type;
    const linkNodeOneId = link.nodes[0].id;
    const linkNodeTwoPlatform = link.nodes[1].platform;
    const linkNodeTwoType = link.nodes[1].type;
    const linkNodeTwoId = link.nodes[1].id;

    const linkString = `${linkNodeOnePlatform}_${linkNodeOneType}_${linkNodeOneId} <---> ${linkNodeTwoPlatform}_${linkNodeTwoType}_${linkNodeTwoId}`;
    console.log("[LINK]", linkString);

    const platformOne = individualResultsCopy[linkNodeOnePlatform];
    const platformTwo = individualResultsCopy[linkNodeTwoPlatform];

    if (!platformOne || !platformTwo) {
      // looking at link that is not relevant
      return;
    }

    let nodeOne;
    const scopeOne = platformOne[linkNodeOneType];
    if (scopeOne) {
      const idArray = scopeOne.filter(
        i =>
          i.identifier ===
          createIdentifier(linkNodeOnePlatform, linkNodeOneType, linkNodeOneId)
      );
      if (idArray.length > 0) {
        nodeOne = idArray[0];
      }
    }

    let nodeTwo;
    const scopeTwo = platformTwo[linkNodeTwoType];
    if (scopeTwo) {
      const idArray = scopeTwo.filter(
        i =>
          i.identifier ===
          createIdentifier(linkNodeTwoPlatform, linkNodeTwoType, linkNodeTwoId)
      );
      if (idArray.length > 0) {
        nodeTwo = idArray[0];
      }
    }

    if (nodeOne && nodeTwo) {
      console.log("both nodes already available from step 1", nodeOne, nodeTwo);
      nodeOne.isPartOf.push(linkColor);
      nodeOne.isNew = true;
      nodeTwo.isPartOf.push(linkColor);
      nodeTwo.isNew = true;
    } else if (nodeOne) {
      console.log(
        "left node already available from step 1 -> fetch right node"
      );
      nodeOne.isPartOf.push(linkColor);
      nodeOne.isNew = true;
      promises.push(
        fetchMissingResource(
          linkNodeTwoPlatform,
          linkNodeTwoType,
          linkNodeTwoId,
          linkColor
        )
      );
    } else if (nodeTwo) {
      console.log(
        "right node already available from step 1 -> fetch left node"
      );
      nodeTwo.isPartOf.push(linkColor);
      nodeTwo.isNew = true;
      promises.push(
        fetchMissingResource(
          linkNodeOnePlatform,
          linkNodeOneType,
          linkNodeOneId,
          linkColor
        )
      );
    } else {
      console.log(
        "no node available from step 1 -> link not needed -> nothing to do!"
      );
      // nothing to do
    }
  });

  const newResourcesCollection = await Promise.all(promises);
  newResourcesCollection.forEach(newResource => {
    individualResultsCopy[newResource.platform][newResource.type].push(
      newResource
    );
  });

  return makeResultsDistinct(individualResultsCopy);
};

const makeResultsDistinct = results => {
  return processResults(results, (item, platform, type, processedResults) => {
    const alreadyExistingItems = processedResults[platform][type].filter(
      i => i.identifier === item.identifier
    );
    if (alreadyExistingItems.length > 0) {
      alreadyExistingItems[0].isPartOf = [
        ...alreadyExistingItems[0].isPartOf,
        ...item.isPartOf
      ];
    } else {
      processedResults[platform][type].push(item);
    }
  });
};

const fetchMissingResource = (platform, type, id, groupId) => {
  return getById(platform, type, id, groupId);
};

exports.postLink = async (req, res) => {
  console.log("Post new link...", "start");
  const apiData = req.body;

  try {
    const nodes = [apiData.node1, apiData.node2];
    await Link.create({ nodes });

    // link creation was successful
    const linkColor = randomColor();

    console.log("Post new link...", "done");
    res.json(linkColor);
  } catch (error) {
    console.log("Post new link...", "error");
    console.error(error);
    res.sendStatus(500);
  }
};
