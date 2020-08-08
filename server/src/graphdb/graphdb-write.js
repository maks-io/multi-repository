//Executing a sparql update query
const { UpdateQueryPayload } = require("graphdb").query;
const { QueryContentType } = require("graphdb").http;
const { GraphDB, GraphDBRepository } = require("./graphdb-server-client");

const exampleQuery = `
    PREFIX <http://bedrock/>
    INSERT DATA {
        :fred :hasSpouse :wilma .
        :fred :hasChild :pebbles .
        :wilma :hasChild :pebbles .
        :pebbles :hasSpouse :bamm-bamm ;
            :hasChild :roxy, :chip.
    }
`;

const payload = new UpdateQueryPayload()
  .setQuery(exampleQuery)
  .setContentType(QueryContentType.SPARQL_QUERY)
  .setInference(true)
  .setTimeout(5);

const writeToDB = async () => {
  await GraphDBRepository().update(payload);
};

module.exports = { writeToDB };
/*

return repository.update(payload).then(() => {
  // repository should have been updated at this point
});
*/
