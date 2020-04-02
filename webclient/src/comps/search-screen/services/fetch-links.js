import { createIdentifier } from "../../../services/create-identifier";
import axios from "axios";
import { mergeStepResults } from "./merge-step-results";
import _ from "lodash";

export const fetchLinks = async that => {
  const { resources } = that.state;

  const apiData = {
    GITLAB: {
      PERSON: resources.GITLAB.PERSON.items.map(i => ({
        identifier: createIdentifier("GITLAB", "PERSON", i.id), // TODO this step should already be done on backend after the search result is available
        isPartOf: []
      })),
      PROJECT: resources.GITLAB.PROJECT.items.map(i => ({
        identifier: createIdentifier("GITLAB", "PROJECT", i.id),
        isPartOf: []
      }))
    },
    GITHUB: {
      PERSON: resources.GITHUB.PERSON.items.map(i => ({
        identifier: createIdentifier("GITHUB", "PERSON", i.id),
        isPartOf: []
      })),
      PROJECT: resources.GITHUB.PROJECT.items.map(i => ({
        identifier: createIdentifier("GITHUB", "PROJECT", i.id),
        isPartOf: []
      }))
    },
    REPOSITUM: {
      PROJECT: resources.REPOSITUM.PROJECT.items.map(i => ({
        identifier: createIdentifier(
          "REPOSITUM",
          "PROJECT",
          i.result.header["dri:objIdentifier"]
        ),
        isPartOf: []
      })),
      PERSON: [] // not available
    },
    INVENIO: {
      PROJECT: resources.INVENIO.PROJECT.items.map(i => ({
        identifier: createIdentifier("INVENIO", "PROJECT", i.id),
        isPartOf: []
      })),
      PERSON: [] // not available
    },
    TISS: {
      PROJECT: resources.TISS.PROJECT.items.map(i => ({
        identifier: createIdentifier("TISS", "PROJECT", i.projectId),
        isPartOf: []
      })),
      PERSON: resources.TISS.PERSON.items.map(i => ({
        identifier: createIdentifier("TISS", "PERSON", i.tiss_id),
        isPartOf: []
      }))
    }
  };

  const { data: resultStep1 } = await axios.post(`/api/links/`, apiData);

  const mergedResults = mergeStepResults(that.state.resources, resultStep1);

  const sortFn = o => o.isPartOf.length * -1;
  that.setState({
    loadingStep: -1,
    resources: {
      TISS: {
        PERSON: {
          items: _.sortBy(mergedResults.TISS.PERSON, sortFn),
          isLoading: false
        },
        PROJECT: {
          items: _.sortBy(mergedResults.TISS.PROJECT, sortFn),
          isLoading: false
        }
      },
      REPOSITUM: {
        PROJECT: {
          items: _.sortBy(mergedResults.REPOSITUM.PROJECT, sortFn),
          isLoading: false
        }
      },
      INVENIO: {
        PROJECT: {
          items: _.sortBy(mergedResults.INVENIO.PROJECT, sortFn),
          isLoading: false
        }
      },
      GITLAB: {
        PERSON: {
          items: _.sortBy(mergedResults.GITLAB.PERSON, sortFn),
          isLoading: false
        },
        PROJECT: {
          items: _.sortBy(mergedResults.GITLAB.PROJECT, sortFn),
          isLoading: false
        }
      },
      GITHUB: {
        PERSON: {
          items: _.sortBy(mergedResults.GITHUB.PERSON, sortFn),
          isLoading: false
        },
        PROJECT: {
          items: _.sortBy(mergedResults.GITHUB.PROJECT, sortFn),
          isLoading: false
        }
      }
    }
  });
};
