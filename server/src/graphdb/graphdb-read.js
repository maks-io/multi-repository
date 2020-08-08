// SELECT query returning data objects

repository.registerParser(new SparqlXmlResultParser());

const payload = new GetQueryPayload()
  .setQuery("select * where {?s ?p ?o}")
  .setQueryType(QueryType.SELECT)
  .setResponseType(RDFMimeType.SPARQL_RESULTS_XML)
  .setLimit(100);

return repository.query(payload).then(stream => {
  stream.on("data", bindings => {
    // the bindings stream converted to data objects with the registered parser
  });
  stream.on("end", () => {
    // handle end of the stream
  });
});

//////////////////////////

// ASK query returning a boolean result

const payload = new GetQueryPayload()
  .setQuery("ask {?s ?p ?o}")
  .setQueryType(QueryType.ASK)
  .setResponseType(RDFMimeType.BOOLEAN_RESULT);

repository.registerParser(new SparqlJsonResultParser());

return repository.query(payload).then(data => {
  // data => true|false
});
