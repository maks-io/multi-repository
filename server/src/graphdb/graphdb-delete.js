//Executing a sparql update query
const {
  getGraphDBRDFRepositoryClient
} = require("./graphdb-RDFRepositoryClient");
const { UpdateQueryPayload } = require("graphdb").query;
const { QueryContentType } = require("graphdb").http;

/*
// useful link:
// https://docs.marklogic.com/guide/semantics/sparql-update#id_48525
const q = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
INSERT DATA
{
  rdf:aha rdf:title rdf:hi2
}
`;
*/

const prefixKeyDefault = "rdf";
const prefixValueDefault = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

const createDeleteQuery = (
  prefixKey = prefixKeyDefault,
  prefixValue = prefixValueDefault,
  subject,
  predicate,
  obj
) => {
  if (!subject) {
    throw new Error("Subject of query is undefined");
  }
  // if (!predicate) {
  //   throw new Error("Predicate of query is undefined");
  // }
  if (!obj) {
    throw new Error("Object of query is undefined");
  }

  return `
           PREFIX ${prefixKey}: <${prefixValue}>
           DELETE WHERE
           {
             ${prefixKey}:${subject} ?p ${prefixKey}:${obj}
           }
        `;


  //return `
  //          PREFIX ${prefixKey}: <${prefixValue}>
  //          INSERT DATA
  //          {
  //            ${subject} ${predicate} ${obj}
  //          }
  //       `;
};

const createDeletePayload = writeQuery => {
  return new UpdateQueryPayload()
    .setQuery(writeQuery)
    .setContentType(QueryContentType.SPARQL_UPDATE)
    .setInference(true)
    .setTimeout(5);
};

const deleteFromDB = async (subject, predicate, obj) => {
  const repository = await getGraphDBRDFRepositoryClient();
  const query = createDeleteQuery(undefined, undefined, subject, predicate, obj);
  const payload = createDeletePayload(query);

  try {
    const result = await repository.update(payload);
    console.log("Deleting from GraphDB - SUCCESS");
  } catch (error) {
    console.error("Deleting from GraphDB - ERROR");
    // console.error("Writing to GraphDB - ERROR:", error);
  }
};

module.exports = { deleteFromDB };
/*

return repository.update(payload).then(() => {
  // repository should have been updated at this point
});
*/
