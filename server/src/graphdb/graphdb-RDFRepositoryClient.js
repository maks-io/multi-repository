const { GraphDB } = require("./graphdb-server-client");
const getGraphDBRDFRepositoryClient = async () => {
  /*
  const { RepositoryClientConfig, RDFRepositoryClient } = graphdb.repository;
  const { RDFMimeType } = graphdb.http;

  const { GRAPHDB_BASE_URL, GRAPHDB_REPOSITORY_NAME } = process.env;

  const endpoint = `${GRAPHDB_BASE_URL}repositories/${GRAPHDB_REPOSITORY_NAME}`;
  // const endpoint = 'http://192.168.178.37:7200/repositories/multi-repository-db'

  const readTimeout = 30000;
  const writeTimeout = 30000;
  const config = new RepositoryClientConfig(
    [endpoint],
    {
      Accept: RDFMimeType.TURTLE
    },
    "",
    readTimeout,
    writeTimeout
  );
  const repository = new RDFRepositoryClient(config);*/

  const { GRAPHDB_BASE_URL, GRAPHDB_REPOSITORY_NAME } = process.env;

  const endpoint = `${GRAPHDB_BASE_URL}repositories/${GRAPHDB_REPOSITORY_NAME}`;

  const graphdb = require("graphdb");
  // const { ServerClient, ServerClientConfig } = graphdb.server;
  // const { RepositoryClientConfig } = graphdb.repository;

  // const config = new ServerClientConfig("http://localhost:7200", 0, {});
  // const server = new ServerClient(config);
  const { RepositoryClientConfig, RDFRepositoryClient } = graphdb.repository;
  const { RDFMimeType } = graphdb.http;

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

  const rdfRepositoryClient = await server.getRepository(
    GRAPHDB_REPOSITORY_NAME,
    repositoryClientConfig
  );

  return rdfRepositoryClient;
};

module.exports = { getGraphDBRDFRepositoryClient };
