import React, { Component } from "react";
import { Card, Input, message } from "antd";
import _ from "lodash";
import axios from "axios";
import LoadingMessage from "./comps/loading-message";
import ResultColumn from "./comps/result-column";
import { fetchLinks } from "./services/fetch-links";
import { constants } from "../../constants";
import { colors } from "../../colors";

const LOADING_MESSAGE_KEY = "loadingMessage";

class MainScreen extends Component {
  state = {
    mode: constants.mode.SEARCH, // one of 'SEARCH', 'FOCUS' and 'EDIT_LINKS'
    // searchTerm: "Default Search Term",
    searchTerm: "Bernhard Gößwein",
    resultSearchTerm: "",
    isLoading: false,
    loadingStep: -1, // -1 ... not loading at all, 0 ... first step (initial searchBothSteps in individual sources), 1 ... second step (linking)
    hoverInfo: {},
    focusInfo: {},
    linkEditInfo: {},
    nrComplete: 0,
    externalResources: undefined,
    resourcesState: undefined
  };

  componentDidMount = async () => {
    const externalResourcesPromise = axios.get("/api/external-resources");
    const relationshipsPromise = axios.get("/api/relationships");

    const [externalResources, relationships] = await Promise.all([
      externalResourcesPromise,
      relationshipsPromise
    ]);

    this.setState(
      {
        externalResources: externalResources.data,
        relationships: relationships.data
      },
      () => {
        const initialResources = this.getInitialResources(false);
        this.setState({ resourcesState: initialResources });
      }
    );
  };

  getInitialResources = isLoading => {
    const { externalResources } = this.state;
    const initialResources = {};
    externalResources.forEach(externalResource => {
      _.set(
        initialResources,
        `${externalResource.platform}.${externalResource.type}`,
        { items: [], isLoading }
      );
    });
    return initialResources;
  };

  searchResource = async (platform, type, searchTerm) => {
    const messagePrefix = `[${platform} - ${type}]`;
    console.log(`\t\t${messagePrefix} searchResource...`, "start");

    const url = `/api/search-by-term/${platform}/${type}/${searchTerm}`;

    try {
      const { data } = await axios.get(url);

      if (this.state.searchFailed) {
        // if the search failed somewhere else, we don't want to update the state anymore
        console.log(
          `\t\t${messagePrefix} searchResource...`,
          "done, but already failed somewhere else."
        );
        return;
      }

      const filteredResults =
        this.state.mode !== constants.mode.EDIT_LINKS
          ? data.results
          : data.results.filter(
              r =>
                !this.state.linkEditInfo.linkedItemsIdentifiers.includes(
                  r.identifier
                )
            );

      this.setState(
        prevState => ({
          resourcesState: {
            ...prevState.resourcesState,
            [platform]: {
              ...prevState.resourcesState[platform],
              [type]: {
                items: [
                  ...prevState.resourcesState[platform][type].items, // this is [] if mode !== "EDIT_LINKS"
                  ...filteredResults.map(r => ({
                    ...r,
                    isPartOf: [],
                    resultStructure: data.resultStructure
                  }))
                ],
                isLoading: false
              }
            }
          },
          nrComplete: prevState.nrComplete + 1
        }),
        () =>
          this.updateLoadingMessage(
            this.state.mode === constants.mode.EDIT_LINKS ? 1 : 2
          )
      );

      console.log(
        `\t\t${messagePrefix} searchResource... done (${
          data.results.length
        } items found${
          this.state.mode === constants.mode.EDIT_LINKS
            ? `, ${data.results.length - filteredResults.length} filtered out`
            : ""
        })`
      );
    } catch (error) {
      const errorMessage = `\t\t${messagePrefix} searchResource... failed`;
      console.error(errorMessage);
      message.error({
        content: errorMessage,
        duration: 2.5,
        key: LOADING_MESSAGE_KEY
      });
      this.setState({ searchFailed: true });
    }
  };

  updateLoadingMessage = (nrOfSteps, loadingStep) => {
    const numberOfResources = this.getResourcesFlat().length;
    const loadingMessage = (
      <LoadingMessage
        loadingStep={loadingStep}
        nrOfSteps={nrOfSteps}
        nrComplete={this.state.nrComplete}
        nrTotal={numberOfResources}
      />
    );

    message.loading({
      content: loadingMessage,
      duration: 0,
      key: LOADING_MESSAGE_KEY
    });
  };

  getResourcesFlat = () => {
    const { externalResources, resourcesState } = this.state;
    return externalResources.map(er => ({
      ...resourcesState[er.platform][er.type],
      platform: er.platform,
      type: er.type,
      logoUrl: er.logoUrl,
      fallbackAvatar: er.fallbackAvatar
    }));
  };

  searchWithEditLinksMode = async () => {
    this.updateLoadingMessage(1);

    await this.searchStep0();

    // TODO: maybe also extract:
    const numberOfResources = this.state.externalResources.length;
    message.success({
      content: (
        <LoadingMessage
          loadingStep={-1}
          nrTotal={numberOfResources}
          nrOfSteps={1}
        />
      ),
      duration: 2.5,
      key: LOADING_MESSAGE_KEY
    });
  };

  searchWithSearchMode = async () => {
    this.updateLoadingMessage(2, 0);

    await this.searchStep0();

    this.updateLoadingMessage(2, 1);

    await this.searchStep1();

    // TODO: maybe also extract:
    const numberOfResources = this.state.externalResources.length;
    message.success({
      content: <LoadingMessage loadingStep={-1} nrTotal={numberOfResources} />,
      duration: 2.5,
      key: LOADING_MESSAGE_KEY
    });
  };

  searchStep0 = async () => {
    this.setState({ loadingStep: 0 });

    const { searchTerm } = this.state;
    console.log(
      `\tSearch step 0 (with searchTerm '${searchTerm}')...`,
      "start"
    );

    try {
      const resourcesFlat = this.getResourcesFlat();

      const promisesStep0 = resourcesFlat.map(r =>
        this.searchResource(r.platform, r.type, searchTerm)
      );

      await Promise.all(promisesStep0);

      console.log(
        `\tSearch step 0 (with searchTerm '${searchTerm}')...`,
        "done"
      );
    } catch (error) {
      const errorMessage = `\tSearch step 0 (with searchTerm '${searchTerm}')... failed`;
      console.error(errorMessage);
      message.error({
        content: errorMessage,
        duration: 2.5,
        key: LOADING_MESSAGE_KEY
      });
      throw new Error(error);
    }
  };

  searchStep1 = async () => {
    console.log(`\tSearch step 1...`, "start");

    this.setState({
      isLoading: false,
      loadingStep: 1
      // resultSearchTerm: searchTerm  TODO is this still needed?
    });

    try {
      await fetchLinks(this);
    } catch (error) {
      const errorMessage = `\tSearch step 1... failed`;
      console.error(errorMessage);
      message.error({
        content: errorMessage,
        duration: 2.5,
        key: LOADING_MESSAGE_KEY
      });
      throw new Error(error);
    }
    console.log(`\tSearch step 1...`, "done");
  };

  cancelDebouncedSearch = () => this.debouncedSearch.cancel();

  resetSearch = (resetSearchTerm = true, markLinkedItemsAsSticky = false) => {
    const resourcesState = this.getInitialResources(false);

    if (markLinkedItemsAsSticky) {
      this.state.externalResources.forEach(er => {
        this.state.resourcesState[er.platform][er.type].items.forEach(item => {
          if (item.isSticky) {
            resourcesState[er.platform][er.type].items.push(item);
          }
        });
      });
    }

    this.setState({
      searchTerm: resetSearchTerm ? "" : this.state.searchTerm,
      resultSearchTerm: "",
      nrComplete: 0,
      isLoading: false,
      searchFailed: false,
      resourcesState
    });
  };

  search = async () => {
    const { mode } = this.state;

    this.cancelDebouncedSearch();

    this.resetSearch(false, mode === constants.mode.EDIT_LINKS);

    console.log(`Search in mode ${mode}...`, "start");
    try {
      if (mode === constants.mode.EDIT_LINKS) {
        await this.searchWithEditLinksMode();
      } else {
        await this.searchWithSearchMode();
      }
      console.log(`Search in mode ${mode}...`, "done");
    } catch (error) {
      console.error(`Search in mode ${mode}...`, "failed");
    }
  };

  debouncedSearch = _.debounce(this.search, 1000);

  handleHoverItem = (identifier, links) => {
    if (this.state.mode === constants.mode.EDIT_LINKS) {
      // avoid hovering when editing links
      return;
    }
    if (!identifier) {
      this.setState({ hoverInfo: {} });
    } else {
      this.setState({
        hoverInfo: { identifier, linkIds: links.map(link => link.link) }
      });
    }
  };

  handleClickItem = (identifier, linkIds) => {
    console.log("handleClickItem with", identifier);
    if (this.state.mode === constants.mode.EDIT_LINKS) {
      // do nothing
    } else if (!identifier) {
      this.setState({ mode: constants.mode.SEARCH, focusInfo: {} });
    } else if (identifier === this.state.focusInfo.identifier) {
      this.setState({ mode: constants.mode.SEARCH, focusInfo: {} });
    } else {
      this.setState({
        mode: constants.mode.FOCUS,
        focusInfo: { identifier, linkIds: linkIds.map(linkId => linkId.link) }
      });
    }
  };

  handleLinkTagClick = (identifier, links) => {
    console.log("linkssss", links);
    const linkIds = links.map(l => l.link);

    if (identifier === this.state.linkEditInfo.activeIdentifier) {
      // already in mode EDIT_LINKS => go back to mode SEARCH:

      this.setState({ mode: constants.mode.SEARCH, linkEditInfo: {} });
    } else {
      // currently in mode SEARCH => go to mode EDIT_LINKS:

      this.handleHoverItem(); // to reset hovering

      // mark linked items as sticky:
      const resourcesState = _.cloneDeep(this.state.resourcesState);
      const linkedItemsIdentifiers = [];
      this.state.externalResources.forEach(er => {
        resourcesState[er.platform][er.type].items.forEach(item => {
          if (
            linkIds.some(linkId =>
              item.isPartOf.map(l => l.link).includes(linkId)
            )
          ) {
            item.isSticky = true;
            linkedItemsIdentifiers.push(item.identifier);
          }
        });
      });

      this.setState({
        mode: constants.mode.EDIT_LINKS,
        linkEditInfo: {
          activeIdentifier: identifier,
          linkIds,
          linkedItemsIdentifiers
        },
        resourcesState
      });
    }
  };

  handleRemoveLinkConfirm = async (identifier, linkId) => {
    const node1 = this.getItemByIdentifier(
      this.state.linkEditInfo.activeIdentifier
    );
    const node2 = this.getItemByIdentifier(identifier);

    try {
      await axios.delete(`/api/link/`, {
        data: {
          node1: {
            platform: node1.platform,
            type: node1.type,
            id: node1.id
          },
          node2: {
            platform: node2.platform,
            type: node2.type,
            id: node2.id
          }
        }
      });

      console.log(1)

      // now remove the link on UI side:
      const clonedResourcesState = _.cloneDeep(this.state.resourcesState);
      this.state.externalResources.forEach(er => {
        clonedResourcesState[er.platform][er.type].items.forEach(item => {
          item.isPartOf = item.isPartOf.filter(id => id.link !== linkId);
          if (item.identifier === identifier) {
            item.isSticky = false;
          }
        });
      });
      console.log(2, linkId)

      this.setState({
        resourcesState: clonedResourcesState,
        linkEditInfo: {
          activeIdentifier: this.state.linkEditInfo.activeIdentifier,
          linkIds: this.state.linkEditInfo.linkIds.filter(id => id !== linkId.link),
          linkedItemsIdentifiers: this.state.linkEditInfo.linkedItemsIdentifiers.filter(
            l => l !== identifier
          )
        }
      });
      console.log(3)

      message.success({
        content: "Link successfully removed!",
        duration: 2.5,
        key: LOADING_MESSAGE_KEY
      });
    } catch (error) {
      message.error({
        content: "Link removal failed!",
        duration: 2.5,
        key: LOADING_MESSAGE_KEY
      });
    }
  };

  handleAddLinkConfirm = async (event, identifier, relationship) => {
    const activeElement = this.getItemByIdentifier(
      this.state.linkEditInfo.activeIdentifier
    );
    const linkElement = this.getItemByIdentifier(identifier);

    try {
      const newLinkId = (
        await axios.post(`/api/link/`, {
          node1: {
            platform: activeElement.platform,
            type: activeElement.type,
            id: activeElement.id
          },
          node2: {
            platform: linkElement.platform,
            type: linkElement.type,
            id: linkElement.id
          },
          relationship
        })
      ).data;

      const resourcesState = this.getUpdatedResourcesStateWithNewLinkId(
        [activeElement.identifier, identifier],
        { link: `${activeElement.identifier}:::::${identifier}`, relationship }
      );

      this.setState({
        resourcesState,
        linkEditInfo: {
          ...this.state.linkEditInfo,
          // linkIds: [...this.state.linkEditInfo.linkIds, newLinkId],
          linkedItemsIdentifiers: [
            ...this.state.linkEditInfo.linkedItemsIdentifiers,
            identifier
          ]
        }
      });

      message.success({
        content: "Link successfully created!",
        duration: 2.5,
        key: LOADING_MESSAGE_KEY
      });
    } catch (error) {
      message.error({
        content: "Link creation failed!",
        duration: 2.5,
        key: LOADING_MESSAGE_KEY
      });
    }
  };

  getUpdatedResourcesStateWithNewLinkId = (identifiers, newLinkId) => {
    // console.log("getUpdatedResourcesStateWithNewLinkId")
    const clonedResourcesState = _.cloneDeep(this.state.resourcesState);
    const identifierOfNewlyLinkedItem = identifiers[1];
    this.state.externalResources.forEach(er => {
      clonedResourcesState[er.platform][er.type].items.forEach(item => {
        if (identifiers.includes(item.identifier)) {
          item.isPartOf = [...item.isPartOf, newLinkId];
        }
        if (item.identifier === identifierOfNewlyLinkedItem) {
          item.isSticky = true;
        }
      });
    });
    return clonedResourcesState;
  };

  getItemByIdentifier = identifier => {
    const snippets = identifier.split("_");
    const platform = snippets[0];
    const type = snippets[1];
    return {
      ...this.state.resourcesState[platform][type].items.find(
        r => r.identifier === identifier
      ),
      platform,
      type
    };
  };

  render() {
    const {
      mode,
      externalResources,
      resourcesState,
      isLoading,
      searchTerm,
      loadingStep: fetchStep
    } = this.state;

    if (!externalResources || !resourcesState) {
      return <div>Initializing... please wait!</div>;
    }

    const resourcesFlat = this.getResourcesFlat();
    const numberOfResources = externalResources.length;

    return (
      <div
        id={"main-screen"}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: colors.Gainsboro
        }}
      >
        <Card
          onClick={() => this.setState({ mode: constants.mode.SEARCH })}
          size="small"
          style={{
            cursor: "pointer",
            position: "absolute",
            right: 0,
            borderRadius: "0.5rem",
            margin: "1.5rem",
            zIndex: 5,
            width: 260,
            backgroundColor:
              this.state.mode === constants.mode.FOCUS
                ? colors.Focus
                : this.state.mode === constants.mode.EDIT_LINKS
                ? colors.EditLinks
                : "white"
          }}
          bodyStyle={{ height: "max-content" }}
        >
          <div>Current View:</div>
          <h1 style={{ margin: 0 }}>{this.state.mode}</h1>
          <div>
            {this.state.mode !== constants.mode.SEARCH ? (
              <small>(click to get back to SEARCH)</small>
            ) : (
              ""
            )}
          </div>
        </Card>
        <h1
          style={{
            fontWeight: "bold",
            letterSpacing: "0.45rem",
            opacity: 0.6,
            marginTop: "2rem",
            color: colors.BlackCoral
          }}
        >
          MULTI REPOSITORY
        </h1>
        <div
          style={{ display: "flex", margin: "1rem", justifyContent: "center" }}
        >
          <Input.Search
            disabled={
              this.state.mode === constants.mode.FOCUS ||
              this.state.loadingStep !== -1
            }
            style={{
              opacity:
                (this.state.mode === constants.mode.FOCUS ||
                  this.state.loadingStep !== -1) &&
                "0.25",
              width: "20rem"
            }}
            id="search"
            value={searchTerm}
            placeholder="Search for person, project,..."
            loading={isLoading}
            onChange={e => {
              if (e.target.value.length === 0) {
                this.cancelDebouncedSearch();
                this.resetSearch();
              } else {
                this.setState(
                  { searchTerm: e.target.value },
                  this.debouncedSearch
                );
              }
            }}
            onSearch={this.search}
            onPressEnter={this.search}
            onKeyDown={e => {
              if (e.key === "Escape") {
                this.cancelDebouncedSearch();
                this.resetSearch();
              }
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "1rem",
            marginTop: 0
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "row"
            }}
          >
            {resourcesFlat.map(resource => (
              <ResultColumn
                key={`${resource.platform}_${resource.type}`}
                platform={resource.platform}
                type={resource.type}
                loadingStep={fetchStep}
                logoUrl={resource.logoUrl}
                fallbackAvatar={resource.fallbackAvatar}
                items={resource.items}
                isLoading={resource.isLoading}
                mode={mode}
                fetchStep={fetchStep}
                handleHoverItem={this.handleHoverItem}
                hoverInfo={this.state.hoverInfo}
                handleClickItem={this.handleClickItem}
                focusInfo={this.state.focusInfo}
                linkEditInfo={this.state.linkEditInfo}
                columnWidth={`${90 / numberOfResources}vw`}
                handleLinkTagClick={this.handleLinkTagClick}
                handleRemoveLinkConfirm={this.handleRemoveLinkConfirm}
                handleAddLinkConfirm={this.handleAddLinkConfirm}
                relationships={this.state.relationships}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default MainScreen;
