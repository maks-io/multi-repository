// TODO also needed on backend => lerna?
export const createIdentifier = (platform, type, id) =>
  `${platform}_${type}_${id}`;
