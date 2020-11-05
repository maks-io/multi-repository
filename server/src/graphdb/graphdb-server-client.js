let serverClient;

const initGraphDBServerClient = async () => {
  const { GRAPHDB_BASE_URL, GRAPHDB_REPOSITORY_NAME } = process.env;

  if (!GRAPHDB_BASE_URL) {
    throw new Error("GRAPHDB_BASE_URL is undefined");
  }

  if (!GRAPHDB_REPOSITORY_NAME) {
    throw new Error("GRAPHDB_REPOSITORY_NAME is undefined");
  }

  console.log(`Try to initialize GraphDB at base url ${GRAPHDB_BASE_URL}...`);

  const graphdb = require("graphdb");
  const { server, http } = graphdb;
  const { ServerClient, ServerClientConfig } = server;
  const { RDFMimeType } = http;

  const serverConfig = new ServerClientConfig(GRAPHDB_BASE_URL, 0, {
    Accept: RDFMimeType.SPARQL_RESULTS_JSON
  });

  serverClient = new ServerClient(serverConfig);

  console.log(`...done`);

  console.log(
    `Check if GraphDB Repository '${GRAPHDB_REPOSITORY_NAME}' exists...`
  );
  const hasRepository = await serverClient.hasRepository(
    GRAPHDB_REPOSITORY_NAME
  );
  if (!hasRepository) {
    throw new Error(
      `GraphDB Repository '${GRAPHDB_REPOSITORY_NAME}' not found.`
    );
  }
  console.log(`...done`);
};

const GraphDB = () => serverClient;

const GraphDBRepository = () => {
  const { GRAPHDB_REPOSITORY_NAME } = process.env;
  const config = {};
  return serverClient.getRepository(GRAPHDB_REPOSITORY_NAME, config);
};

module.exports = { initGraphDBServerClient, GraphDB, GraphDBRepository };
