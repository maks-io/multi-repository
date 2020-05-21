const _ = require("lodash");
const { getExternalResources } = require("../controllers/external-resource-controller");

const processResults = (results, processFunction) => {
  const processedResults = {};

  const externalResources = getExternalResources();
  externalResources.forEach(er => {
    const { platform, type } = er;
    _.set(processedResults, `${platform}.${type}`, []);
    results[platform][type].forEach(item =>
      processFunction(item, platform, type, processedResults)
    );
  });

  return processedResults;
};

module.exports = { processResults };
