//Executing a sparql update query
const {
  getGraphDBRDFRepositoryClient
} = require("./graphdb-RDFRepositoryClient");
const { UpdateQueryPayload } = require("graphdb").query;
const { QueryContentType } = require("graphdb").http;

// useful link:
// https://docs.marklogic.com/guide/semantics/sparql-update
const q = `
PREFIX dc: <http://marklogic.com/dc/elements/1.1/>
INSERT DATA
{
  <http://example/book0> dc:title "A default book"
}
`;

const payload = new UpdateQueryPayload()
  .setQuery(q)
  .setContentType(QueryContentType.SPARQL_UPDATE)
  .setInference(true)
  .setTimeout(5);

const writeToDB = async () => {
  const repository = await getGraphDBRDFRepositoryClient();

  console.log("REPO", repository);

  try {
    const result = await repository.update(payload);
    console.log("Writing to GraphDB - SUCCESS");
  } catch (error) {
    console.error("Writing to GraphDB - ERROR:");
    // console.error("Writing to GraphDB - ERROR:", error);
  }
};

module.exports = { writeToDB };
/*

return repository.update(payload).then(() => {
  // repository should have been updated at this point
});
*/
