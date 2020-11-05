const createIdentifier = (platform, type, id, delimiter = "_") =>
  `${platform}${delimiter}${type}${delimiter}${id}`;

module.exports = { createIdentifier };
