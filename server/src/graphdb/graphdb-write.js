const {
  getGraphDBRDFRepositoryClient
} = require("./graphdb-RDFRepositoryClient");
const { UpdateQueryPayload } = require("graphdb").query;
const { QueryContentType } = require("graphdb").http;

const prefixKeyDefault = "rdf";
const prefixValueDefault = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

const createWriteQuery = (
  prefixKey = prefixKeyDefault,
  prefixValue = prefixValueDefault,
  subject,
  predicate,
  obj
) => {
  if (!subject) {
    throw new Error("Subject of query is undefined");
  }
  if (!predicate) {
    throw new Error("Predicate of query is undefined");
  }
  if (!obj) {
    throw new Error("Object of query is undefined");
  }

  return `
           PREFIX ${prefixKey}: <${prefixValue}>
           INSERT DATA
           {
             ${prefixKey}:${subject} ${prefixKey}:${predicate} ${prefixKey}:${obj}
           }

        `;
};

const createWritePayload = writeQuery => {
  return new UpdateQueryPayload()
    .setQuery(writeQuery)
    .setContentType(QueryContentType.SPARQL_UPDATE)
    .setInference(true)
    .setTimeout(5);
};

const writeToDB = async (subject, predicate, obj) => {
  const repository = await getGraphDBRDFRepositoryClient();
  const query = createWriteQuery(undefined, undefined, subject, predicate, obj);
  const payload = createWritePayload(query);

  try {
    const result = await repository.update(payload);
    console.log("Writing to GraphDB - SUCCESS");
  } catch (error) {
    console.error("Writing to GraphDB - ERROR");
  }
};

const clearDB = async () => {
  const repository = await getGraphDBRDFRepositoryClient();
  const query = "CLEAR SILENT ALL";
  const payload = createWritePayload(query);

  try {
    await repository.update(payload);
    console.log("Clearing GraphDB - SUCCESS");
  } catch (error) {
    console.error("Clearing GraphDB - ERROR" + error);
  }
};

module.exports = { writeToDB, clearDB };
