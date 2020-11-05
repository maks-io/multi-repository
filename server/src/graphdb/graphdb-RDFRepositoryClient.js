const { initGraphDBServerClient } = require("./graphdb-server-client");
const { GraphDB } = require("./graphdb-server-client");

let rdfRepositoryClient;

const getGraphDBRDFRepositoryClient = async () => {
  if (rdfRepositoryClient) {
    return rdfRepositoryClient;
  }

  const { GRAPHDB_BASE_URL, GRAPHDB_REPOSITORY_NAME } = process.env;

  const endpoint = `${GRAPHDB_BASE_URL}repositories/${GRAPHDB_REPOSITORY_NAME}`;

  const graphdb = require("graphdb");

  const { RepositoryClientConfig } = graphdb.repository;

  await initGraphDBServerClient();
  const server = GraphDB();

  const readTimeout = 30000;
  const writeTimeout = 30000;
  const repositoryClientConfig = new RepositoryClientConfig(
    [endpoint],
    {},
    "",
    readTimeout,
    writeTimeout
  );

  rdfRepositoryClient = await server.getRepository(
    GRAPHDB_REPOSITORY_NAME,
    repositoryClientConfig
  );

  return rdfRepositoryClient;
};

module.exports = { getGraphDBRDFRepositoryClient };
