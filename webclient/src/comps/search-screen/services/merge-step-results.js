import { constants } from "../../../constants";

export const mergeStepResults = (resultStep0, resultStep1) => {
  const { platforms, types } = constants;

  const mergedResult = {};

  platforms.forEach(platform => {
    mergedResult[platform] = {};
    types.forEach(type => {
      mergedResult[platform][type] = [];
      const newItems = resultStep1[platform][type];
      newItems.forEach((newItem, index) => {
        if (!newItem.isNew || newItem.isOld) {
          mergedResult[platform][type].push({
            ...resultStep0[platform][type].items[index],
            group: newItem.group,
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
  });

  return mergedResult;
};
