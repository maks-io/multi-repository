import React, { Component } from "react";
import { Input, message } from "antd";
import _ from "lodash";
import axios from "axios";
import FocusedViewMessage from "./comps/focused-view-message";
import LoadingMessage from "./comps/loading-message";
import ResultColumn from "./comps/result-column";
import { fetchLinks } from "./services/fetch-links";

const LOADING_MESSAGE_KEY = "loadingMessage";

class SearchScreen extends Component {
  state = {
    searchTerm: "",
    resultSearchTerm: "",
    isLoading: false,
    loadingStep: -1, // -1 ... not loading at all, 0 ... first step (initial search in individual sources), 1 ... second step (linking)
    hoverInfo: {},
    focusInfo: {},
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
              items: data.results.map(r => ({
                ...r,
                isPartOf: [],
                resultStructure: data.resultStructure
              })),
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

    this.setState(
      {
        isLoading: true,
        loadingStep: 0,
        hoverInfo: {},
        focusInfo: {},
        nrComplete: 0,
        resourcesState: this.getInitialResources(true)
      },
      this.updateLoadingMessage
    );

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

  resetSearch = () => {
    this.setState({
      searchTerm: "",
      resultSearchTerm: "",
      isLoading: false,
      resourcesState: this.getInitialResources(false)
    });
  };

  handleHoverItem = (identifier, linkIds) => {
    if (!identifier) {
      this.setState({ hoverInfo: {} });
    } else {
      this.setState({ hoverInfo: { identifier, linkIds } });
    }
  };

  handleClickItem = (identifier, linkIds) => {
    if (!identifier) {
      message.destroy();
      this.setState({ focusInfo: {} });
    } else {
      message.destroy();
      message.warn({
        content: (
          <FocusedViewMessage
            currentItemHasLinks={linkIds.length > 0}
            leave={() => this.handleClickItem(undefined)}
          />
        ),
        duration: 0
      });
      this.setState({ focusInfo: { identifier, linkIds } });
    }
  };

  render() {
    const {
      externalResources,
      resourcesState,
      isLoading,
      searchTerm
    } = this.state;

    if (!externalResources || !resourcesState) {
      return <div>Initializing... please wait!</div>;
    }

    const resourcesFlat = this.getResourcesFlat();
    const numberOfResources = externalResources.length;

    const haveResults = searchTerm.length > 0;
    const fetchStep = this.state.loadingStep;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginTop: "2rem"
        }}
      >
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
              this.state.focusInfo.identifier || this.state.loadingStep !== -1
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
                fetchStep={fetchStep}
                handleHoverItem={this.handleHoverItem}
                hoverInfo={this.state.hoverInfo}
                handleClickItem={this.handleClickItem}
                focusInfo={this.state.focusInfo}
                haveResults={haveResults}
                columnWidth={`${90 / numberOfResources}vw`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchScreen;
