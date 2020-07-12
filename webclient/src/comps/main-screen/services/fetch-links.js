import axios from "axios";
import { mergeStepResults } from "./merge-step-results";
import _ from "lodash";

export const fetchLinks = async that => {
  const { externalResources, resourcesState } = that.state;

  const minimizedResourcesState = {};
  externalResources.forEach(er => {
    const resourceState = resourcesState[er.platform][er.type];
    _.set(
      minimizedResourcesState,
      `${er.platform}.${er.type}`,
      resourceState.items.map(i => ({
        identifier: i.identifier,
        isPartOf: i.isPartOf
      }))
    );
  });

  const { data: resultStep1 } = await axios.post(
    `/api/links/`,
    minimizedResourcesState
  );

  const mergedResults = mergeStepResults(
    externalResources,
    resourcesState,
    resultStep1
  );

  const sortFn = o => o.isPartOf.length * -1;

  const newResourcesState = {};
  externalResources.forEach(er => {
    _.set(newResourcesState, `${er.platform}.${er.type}`, {
      isLoading: false,
     // resultStructure:
     //   that.state.resourcesState[er.platform][er.type].resultStructure,
      items: _.sortBy(mergedResults[er.platform][er.type], sortFn)
    });
  });

  that.setState({
    loadingStep: -1,
    resourcesState: newResourcesState
  });
};
