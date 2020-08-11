// SELECT query returning data objects

const {
  getGraphDBRDFRepositoryClient
} = require("./graphdb-RDFRepositoryClient");
const { GetQueryPayload ,QueryType} = require("graphdb").query;
const { RDFMimeType } = require("graphdb").http;
const { SparqlJsonResultParser } = require("graphdb").parser;

// repository.registerParser(new SparqlXmlResultParser());

const createReadQuery = (subject, predicate, obj) => {
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
            select * where {?s rdf:pred3 ?o}
         `;
};

const createReadPayload = readQuery =>
  new GetQueryPayload()
    .setQuery(readQuery)
    .setQueryType(QueryType.SELECT)
    .setResponseType(RDFMimeType.SPARQL_RESULTS_JSON)
    .setLimit(100);

const readFromDB = async (subject, predicate, obj) => {
  const repository = await getGraphDBRDFRepositoryClient();
  repository.registerParser(new SparqlJsonResultParser());
  const query = createReadQuery(subject, predicate, obj);
  const payload = createReadPayload(query);

  try {
    const resultStream = await repository.query(payload);

    resultStream.on("data",(bindings)=>{
      console.log("bindings",bindings)
    })

    resultStream.on("end",(bindings)=>{
      console.log("end")
    })

    // console.log("result", result);
    console.log("Reading from GraphDB - SUCCESS");
  } catch (error) {
    console.error("Reading from GraphDB - ERROR");
    // console.error("Writing to GraphDB - ERROR:", error);
  }
};

//////////////////////////
/*

// ASK query returning a boolean result

const payload = new GetQueryPayload()
  .setQuery("ask {?s ?p ?o}")
  .setQueryType(QueryType.ASK)
  .setResponseType(RDFMimeType.BOOLEAN_RESULT);

repository.registerParser(new SparqlJsonResultParser());

return repository.query(payload).then(data => {
  // data => true|false
});
*/

module.exports = { readFromDB };
