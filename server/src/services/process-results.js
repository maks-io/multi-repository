const { constants } = require("../../../webclient/src/constants");

const processResults = (results, processFunction) => {
  const { platforms, types } = constants;
  const processedResults = {};

  platforms.forEach(platform => {
    processedResults[platform] = {};
    types.forEach(type => {
      processedResults[platform][type] = [];
      results[platform][type].forEach(item =>
        processFunction(item, platform, type, processedResults)
      );
    });
  });

  return processedResults;
};

module.exports = { processResults };
