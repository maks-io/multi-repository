const { readFromDB } = require("./graphdb-read");

const getAllLinks = async () => {
  const allLinks = await readFromDB(undefined, undefined, undefined);
  return allLinks;
};

module.exports = { getAllLinks };
