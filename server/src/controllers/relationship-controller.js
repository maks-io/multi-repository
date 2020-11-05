const { relationships } = require("../config/relationships");

const getRelationships = async (req, res) => {
  res.send(relationships);
};

module.exports = {
  getRelationships
};
