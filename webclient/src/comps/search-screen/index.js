import React, { Component } from "react";
import { Button, Input, message } from "antd";
import _ from "lodash";
import axios from "axios";
import LoadingMessage from "./comps/loading-message";
import ResultColumn from "./comps/result-column";
import { fetchLinks } from "./services/fetch-links";
import { constants } from "../../constants";

const LOADING_MESSAGE_KEY = "loadingMessage";

class SearchScreen extends Component {
  state = {
    mode: "SEARCH", // one of 'SEARCH', 'FOCUS' and 'EDIT_LINKS'
    searchTerm: "Bernhard Gößwein",
    // searchTerm: "",
    resultSearchTerm: "",
    isLoading: false,
    loadingStep: -1, // -1 ... not loading at all, 0 ... first step (initial search in individual sources), 1 ... second step (linking)
    hoverInfo: {},
    focusInfo: {},
    linkEditInfo: {},
    nrComplete: -1,
    externalResources: undefined,
    resourcesState: undefined
  };

  componentDidMount = async () => {
    const externalResources = (await axios.get("/api/external-resources")).data;
    this.setState({ externalResources }, () => {
      const initialResources = this.getInitialResources(false);
      this.setState({ resourcesState: initialResources });
    });
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
    console.log(messagePrefix, "search start...");

    const url = `/api/search-by-term/${platform}/${type}/${searchTerm}`;
    const { data } = await axios.get(url);

    this.setState(
      prevState => ({
        resourcesState: {
          ...prevState.resourcesState,
          [platform]: {
            ...prevState.resourcesState[platform],
            [type]: {
              items: [
                ...prevState.resourcesState[platform][type].items, // this is [] if mode !== "EDIT_LINKS"
                ...data.results.map(r => ({
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
      this.updateLoadingMessage
    );

    console.log(messagePrefix, "...search done!");
  };

  updateLoadingMessage = () => {
    const numberOfResources = this.getResourcesFlat().length;
    const loadingMessage = (
      <LoadingMessage
        loadingStep={0}
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

  search = async () => {
    this.cancelDebouncedSearch();

    this.resetSearch(false);

    this.updateLoadingMessage();

    const { searchTerm } = this.state;
    console.log("Start searching with searchTerm:", searchTerm);

    const resourcesFlat = this.getResourcesFlat();
    const numberOfResources = resourcesFlat.length;

    const promisesStep0 = resourcesFlat.map(r =>
      this.searchResource(r.platform, r.type, searchTerm)
    );

    await Promise.all(promisesStep0);
    console.log("Search step 0 done.");

    message.loading({
      content: <LoadingMessage loadingStep={1} nrTotal={numberOfResources} />,
      duration: 0,
      key: LOADING_MESSAGE_KEY
    });

    this.setState({
      isLoading: false,
      loadingStep: 1,
      resultSearchTerm: searchTerm
    });

    await fetchLinks(this);
    console.log("Search step 1 done.");

    message.success({
      content: <LoadingMessage loadingStep={-1} nrTotal={numberOfResources} />,
      duration: 2.5,
      key: LOADING_MESSAGE_KEY
    });
  };

  debouncedSearch = _.debounce(this.search, 1000);

  cancelDebouncedSearch = () => this.debouncedSearch.cancel();

  resetSearch = (resetSearchTerm = true) => {
    const resourcesState = this.getInitialResources(false);

    if (this.state.mode === constants.mode.EDIT_LINKS) {
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
      resourcesState
    });
  };

  handleHoverItem = (identifier, linkIds) => {
    if (this.state.mode === constants.mode.EDIT_LINKS) {
      // avoid hovering when editing links
      return;
    }
    if (!identifier) {
      this.setState({ hoverInfo: {} });
    } else {
      this.setState({ hoverInfo: { identifier, linkIds } });
    }
  };

  handleClickItem = (identifier, linkIds) => {
    console.log("handleClickItem with", identifier);
    if (this.state.mode === "EDIT_LINKS") {
      // do nothing
    } else if (!identifier) {
      this.setState({ mode: constants.mode.SEARCH, focusInfo: {} });
    } else if (identifier === this.state.focusInfo.identifier) {
      this.setState({ mode: constants.mode.SEARCH, focusInfo: {} });
    } else {
      this.setState({
        mode: constants.mode.FOCUS,
        focusInfo: { identifier, linkIds }
      });
    }
  };

  handleLinkTagClick = (identifier, linkIds) => {
    console.log("handleLinkTagClick with", identifier);
    if (identifier === this.state.linkEditInfo.activeIdentifier) {
      this.setState({ mode: constants.mode.SEARCH, linkEditInfo: {} });
    } else {
      this.handleHoverItem() // to reset hovering

      // mark linked items as sticky:
      const resourcesState = _.cloneDeep(this.state.resourcesState);
      this.state.externalResources.forEach(er => {
        resourcesState[er.platform][er.type].items.forEach(item => {
          if (linkIds.some(linkId => item.isPartOf.includes(linkId))) {
            item.isSticky = true;
          }
        });
      });

      this.setState({
        mode: constants.mode.EDIT_LINKS,
        linkEditInfo: {
          activeIdentifier: identifier,
          linkedItemsIdentifiers: linkIds
        },
        resourcesState
      });
    }
  };

  handleRemoveLinkConfirm = identifier => {
    console.log("handleRemoveLinkConfirm", identifier);
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

    const haveResults = searchTerm.length > 0;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginTop: "2rem"
        }}
      >
        <div
          style={{ position: "absolute", top: 0, right: 0, fontWeight: "bold" }}
        >
          {this.state.mode === "FOCUS" && (
            <Button
              type="primary"
              onClick={() => this.setState({ mode: "SEARCH", focusInfo: {} })}
            >
              Focused-View-Mode -> Click to Leave
            </Button>
          )}
          {this.state.mode === "EDIT_LINKS" && (
            <Button
              type="primary"
              onClick={() =>
                this.setState({ mode: "SEARCH", linkEditInfo: {} })
              }
            >
              Edit-Links-Mode -> Click to Leave
            </Button>
          )}
        </div>
        <h1
          style={{ fontWeight: "bold", letterSpacing: "0.45rem", opacity: 0.6 }}
        >
          MULTI REPOSITORY
        </h1>
        <div
          style={{ display: "flex", margin: "1rem", justifyContent: "center" }}
        >
          <Input.Search
            disabled={
              this.state.mode === "FOCUS" || this.state.loadingStep !== -1
            }
            style={{
              opacity:
                (this.state.focusInfo.identifier ||
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
          <div style={{ display: "flex", flexDirection: "row" }}>
            {resourcesFlat.map(resource => (
              <ResultColumn
                key={`${resource.platform}_${resource.type}`}
                platform={resource.platform}
                type={resource.type}
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
                haveResults={haveResults}
                columnWidth={`${90 / numberOfResources}vw`}
                handleLinkTagClick={this.handleLinkTagClick}
                handleRemoveLinkConfirm={this.handleRemoveLinkConfirm}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchScreen;
