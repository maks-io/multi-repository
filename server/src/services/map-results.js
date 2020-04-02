const { constants } = require("../../../webclient/src/constants");

const mapResults = (results, mapFunction) => {
  const { platforms, types } = constants;
  const processedResults = {};

  platforms.forEach(platform => {
    processedResults[platform] = {};
    types.forEach(type => {
      processedResults[platform][type] = results[platform][type].map(item =>
        mapFunction(item, platform, type)
      );
    });
  });

  return processedResults;
};

module.exports = { mapResults };
