const { clearDB } = require("./graphdb-write");
const { createIdentifier } = require("../services/create-identifier");
const { writeToDB } = require("./graphdb-write");
const { readFromDB } = require("./graphdb-read");

const DELIMITER = ":::::"; // TODO move to cosntants etc
const PREDICATE = "isLinkedTo"; // TODO move to cosntants etc

const deleteAllLinks = async () => {
  await clearDB();
};

const getAllLinks = async () => {
  const allLinks = await readFromDB(undefined, undefined, undefined);
  return allLinks;
};

const createLink = async link => {
  const triple = convertLinkToTriple(link);
  await writeToDB(triple.s, triple.p, triple.o);
};

const createMultipleLinks = async links => {
  console.log(`Creating ${links.length} links...`);

  for (let i = 0; i < links.length; ++i) {
    await createLink(links[i]);
  }

  console.log("...done");
};

const convertTripleToLink = triple => {
  const { s, p, o } = triple;

  const sSplit = s.split(DELIMITER);
  const node1 = {
    platform: sSplit[0],
    type: sSplit[1],
    id: sSplit[2]
  };
  const oSplit = o.split(DELIMITER);
  const node2 = {
    platform: oSplit[0],
    type: oSplit[1],
    id: oSplit[2]
  };

  return { node1, node2 };
};

const convertLinkToTriple = link => {
  const { node1, node2 } = link;
  const identifierNode1 = createIdentifier(
    node1.platform,
    node1.type,
    node1.id,
    DELIMITER
  );
  const identifierNode2 = createIdentifier(
    node2.platform,
    node2.type,
    node2.id,
    DELIMITER
  );
  return { s: identifierNode1, p: PREDICATE, o: identifierNode2 };
};

module.exports = { deleteAllLinks, getAllLinks, createLink,createMultipleLinks };
