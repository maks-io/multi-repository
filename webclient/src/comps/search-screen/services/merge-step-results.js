import _ from "lodash"

export const mergeStepResults = (
  externalResources,
  resultStep0,
  resultStep1
) => {
  const mergedResult = {};

  externalResources.forEach(er => {
    const { platform, type } = er;
    _.set(mergedResult, `${platform}.${type}`, []);
    const newItems = resultStep1[platform][type];
    newItems.forEach((newItem, index) => {
      if (!newItem.isNew || newItem.isOld) {
        mergedResult[platform][type].push({
          ...resultStep0[platform][type].items[index],
          groupId: newItem.groupId,
          isPartOf: newItem.isPartOf,
          identifier: newItem.identifier,
          isNew: newItem.isNew,
          isOld: newItem.isOld
        });
      } else {
        mergedResult[platform][type].push({
          ...resultStep1[platform][type][index]
        });
      }
    });
  });

  return mergedResult;
};
