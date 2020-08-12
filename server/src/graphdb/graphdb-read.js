// SELECT query returning data objects

const {
  getGraphDBRDFRepositoryClient
} = require("./graphdb-RDFRepositoryClient");
const { GetQueryPayload, QueryType } = require("graphdb").query;
const { RDFMimeType } = require("graphdb").http;
const { SparqlJsonResultParser } = require("graphdb").parser;

// repository.registerParser(new SparqlXmlResultParser());

const prefixKeyDefault = "rdf";
const prefixValueDefault = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

const createReadQuery = (
  prefixKey = prefixKeyDefault,
  prefixValue = prefixValueDefault,
  subject,
  predicate,
  obj
) => {
  return `
            select * where {${
              !subject ? "?s" : prefixKeyDefault + ":" + subject
            } ${!predicate ? "?p" : prefixKeyDefault + ":" + predicate} ${
    !obj ? "?o" : prefixKeyDefault + ":" + obj
  }}
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
  const query = createReadQuery(undefined, undefined, subject, predicate, obj);
  console.log("read query is", query);
  const payload = createReadPayload(query);

  try {
    const resultStream = await repository.query(payload);

    const data = [];
    resultStream.on("data", bindings => {
      data.push(bindings);
    });
    /*

    resultStream.on("end", () => {
      // console.log("end");
      console.log("Reading from GraphDB - SUCCESS");
      return data;
    });
*/
    await new Promise(fulfill => resultStream.on("end", fulfill));

    const filteredData = data.filter(triple => {
      const asString = JSON.stringify(triple);
      return (
        triple.s.id.startsWith(prefixValueDefault) &&
        triple.p.id.startsWith(prefixValueDefault) &&
        triple.o.id.startsWith(prefixValueDefault) &&
        !asString.includes("#Property") &&
        !asString.includes("#type") &&
        !asString.includes("#nil") &&
        !asString.includes("#List")
      );
    });

    console.log("bindings length = ", data.length);
    console.log("filteredData length = ", filteredData.length);
    console.log("filteredData  = ", filteredData);
    return filteredData;
    // console.log("result", result);
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
