const { mapResults } = require("../services/map-results");
const { processResults } = require("../services/process-results");
const {
  getProjectById: getProjectByIdTiss
} = require("./tiss-projects-controller");
const {
  getProjectById: getProjectByIdGitlab
} = require("./gitlab-projects-controller");
const {
  getUserById: getUserByIdGitlab
} = require("./gitlab-persons-controller");
const {
  getProjectById: getProjectByIdGithub
} = require("./github-projects-controller");
const {
  getUserById: getUserByIdGithub
} = require("./github-persons-controller");
const { getUserById: getUserByIdTiss } = require("./tiss-persons-controller");
const {
  getProjectById: getProjectByIdRepositum
} = require("./repositum-controller");
const {
  getProjectById: getProjectByIdInvenio
} = require("./invenio-controller");

const _ = require("lodash");
const randomColor = require("randomcolor");

const Link = require("../models/Link");

exports.fetchLinks = async (req, res) => {
  const apiData = req.body;

  console.log("\n/////", "Search Step 2 - Link Logic - START", "/////\n");

  try {
    const links = await Link.find({});
    const newResources = await applyLinkLogic(apiData, links);

    console.log("\n/////", "Search Step 2 - Link Logic - DONE", "/////\n");

    return res.json(newResources);
  } catch (err) {
    console.log("\n/////", "Search Step 2 - Link Logic - ERROR", "/////\n");
    console.error(err);
    res.sendStatus(500);
  }
};

const applyLinkLogic = async (individualResults, links) => {
  const promises = [];
  const individualResultsCopy = _.cloneDeep(individualResults);

  links.forEach(link => {
    const linkColor = randomColor();

    const linkNodeOnePlatform = link.nodes[0].platform;
    const linkNodeOneType = link.nodes[0].type;
    const linkNodeOneId = link.nodes[0].id;
    const linkNodeTwoPlatform = link.nodes[1].platform;
    const linkNodeTwoType = link.nodes[1].type;
    const linkNodeTwoId = link.nodes[1].id;

    const linkString = `${linkNodeOnePlatform}_${linkNodeOneType}_${linkNodeOneId} <---> ${linkNodeTwoPlatform}_${linkNodeTwoType}_${linkNodeTwoId}`;
    console.log("[LINK]", linkString);

    let nodeOne;
    const scopeOne =
      individualResultsCopy[linkNodeOnePlatform][linkNodeOneType];
    if (scopeOne) {
      const idArray = scopeOne.filter(
        i =>
          i.identifier ===
          `${linkNodeOnePlatform}_${linkNodeOneType}_${linkNodeOneId}`
      );
      if (idArray.length > 0) {
        nodeOne = idArray[0];
      }
    }

    let nodeTwo;
    const scopeTwo =
      individualResultsCopy[linkNodeTwoPlatform][linkNodeTwoType];
    if (scopeTwo) {
      const idArray = scopeTwo.filter(
        i =>
          i.identifier ===
          `${linkNodeTwoPlatform}_${linkNodeTwoType}_${linkNodeTwoId}`
      );
      if (idArray.length > 0) {
        nodeTwo = idArray[0];
      }
    }

    if (nodeOne && nodeTwo) {
      console.log("both nodes found", nodeOne, nodeTwo);
      nodeOne.isPartOf.push(linkColor);
      nodeOne.isNew = true;
      nodeOne.isOld = true;
      nodeTwo.isPartOf.push(linkColor);
      nodeTwo.isNew = true;
      nodeTwo.isOld = true;
    } else if (nodeOne) {
      console.log("left node found");
      nodeOne.isPartOf.push(linkColor);
      nodeOne.isNew = true;
      nodeOne.isOld = true;
      promises.push(
        fetchMissingResource(
          linkNodeTwoPlatform,
          linkNodeTwoType,
          linkNodeTwoId,
          linkColor
        )
      );
    } else if (nodeTwo) {
      console.log("right node found");
      nodeTwo.isPartOf.push(linkColor);
      nodeTwo.isNew = true;
      nodeTwo.isOld = true;
      promises.push(
        fetchMissingResource(
          linkNodeOnePlatform,
          linkNodeOneType,
          linkNodeOneId,
          linkColor
        )
      );
    } else {
      console.log("no node found -> link not needed -> nothing to do!");
      // nothing to do
    }
  });

  const newResourcesCollection = await Promise.all(promises);
  newResourcesCollection.forEach(newResource => {
    individualResultsCopy[newResource.platform][newResource.type].push({
      ...newResource.resource,
      isNew: true,
      isPartOf: [newResource.resource.group]
    });
  });

  const resultsWithIdentifiers = addIdentifiersToResults(individualResultsCopy);

  const distinctResults = makeResultsDistinct(resultsWithIdentifiers);

  return distinctResults;
};

// TODO path for ids should be extracted globally -> but they are needed on server AND client side (use lerna?)
const addIdentifiersToResults = results => {
  return mapResults(results, (item, platform, type) => {
    if (item.identifier) {
      return item;
    }

    const originalId = {
      REPOSITUM: {
        PROJECT: _.get(
          item,
          `result.metadata["oaf:entity"]["oaf:result"].originalId`
        )
      },
      GITHUB: {
        PERSON: _.get(item, `id`),
        PROJECT: _.get(item, `id`)
      },
      GITLAB: {
        PERSON: _.get(item, `id`),
        PROJECT: _.get(item, `id`)
      },
      INVENIO: { PROJECT: _.get(item, `name`) },
      TISS: {
        PERSON: _.get(item, `tiss_id`),
        PROJECT: _.get(item, `titleEn`)
      }
    }[platform][type];
    return { ...item, identifier: `${platform}_${type}_${originalId}` };
  });
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

const fetchMissingResource = (platform, type, id, group) => {
  console.log("fetchMissingResource", platform, type, id);
  const fetchFunctions = {
    GITLAB: { PERSON: getUserByIdGitlab, PROJECT: getProjectByIdGitlab },
    GITHUB: { PERSON: getUserByIdGithub, PROJECT: getProjectByIdGithub },
    TISS: { PERSON: getUserByIdTiss, PROJECT: getProjectByIdTiss },
    REPOSITUM: { PROJECT: getProjectByIdRepositum },
    INVENIO: { PROJECT: getProjectByIdInvenio }
  };

  return fetchFunctions[platform][type](id, group);
};
