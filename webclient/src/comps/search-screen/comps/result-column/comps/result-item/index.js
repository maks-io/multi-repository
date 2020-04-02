import React, { Component } from "react";
import { Card } from "antd";
import LinkTag from "./comps/link-tag";
import SourceTag from "./comps/source-tag";
import ResultItemGithubProject from "./comps/result-item-github-project";
import ResultItemGithubPerson from "./comps/result-item-github-person";
import ResultItemRepositumProject from "./comps/result-item-repositum-project";
import ResultItemInvenioProject from "./comps/result-item-invenio-project";
import ResultItemGitlabProject from "./comps/result-item-gitlab-project";
import ResultItemGitlabPerson from "./comps/result-item-gitlab-person";
import ResultItemTissPerson from "./comps/result-item-tiss-person";
import ResultItemTissProject from "./comps/result-item-tiss-project";
import OriginalSourceTag from "./comps/original-source-tag";

const HOVER_DIRECT_COLOR = "#9DB4C0";
const HOVER_INDIRECT_COLOR = "#C2DFE3";

const ResultItemContent = ({ platform, type, data }) => {
  const types = {
    REPOSITUM: {
      PROJECT: <ResultItemRepositumProject data={data} />
    },
    INVENIO: {
      PROJECT: <ResultItemInvenioProject data={data} />
    },
    GITHUB: {
      PROJECT: <ResultItemGithubProject data={data} />,
      PERSON: <ResultItemGithubPerson data={data} />
    },
    GITLAB: {
      PROJECT: <ResultItemGitlabProject data={data} />,
      PERSON: <ResultItemGitlabPerson data={data} />
    },
    TISS: {
      PROJECT: <ResultItemTissProject data={data} />,
      PERSON: <ResultItemTissPerson data={data} />
    }
  };

  return types[platform][type];
};

class ResultItem extends Component {
  render() {
    const {
      data,
      fetchStep,
      index,
      platform,
      type,
      handleHoverItem,
      hoverInfo,
      handleClickItem,
      focusInfo
    } = this.props;

    if (focusInfo.identifier) {
      // some item is focused!
      if (focusInfo.group.length === 0) {
        if (focusInfo.identifier !== data.identifier) {
          return null;
        }
      } else if (!data.isPartOf.some(r => focusInfo.group.includes(r))) {
        return null;
      }
    }

    let hoverStyle = {};
    if (
      Boolean(hoverInfo.identifier) &&
      hoverInfo.identifier === data.identifier
    ) {
      hoverStyle.backgroundColor = HOVER_DIRECT_COLOR;
    } else if (hoverInfo.group) {
      if (data.isNew && hoverInfo.group.includes(data.isPartOf[0])) {
        hoverStyle.backgroundColor = HOVER_INDIRECT_COLOR;
      } else if (data.isPartOf.some(r => hoverInfo.group.includes(r))) {
        hoverStyle.backgroundColor = HOVER_INDIRECT_COLOR;
      }
    }

    return (
      <Card
        size="small"
        style={{
          borderRadius: "0.5rem",
          margin: "0.3rem",
          cursor: "pointer",
          borderWidth:
            focusInfo.identifier &&
            focusInfo.identifier === data.identifier &&
            7,
          ...hoverStyle
        }}
        bodyStyle={{ padding: "0.3rem" }}
        onMouseEnter={() => handleHoverItem(data.identifier, data.isPartOf)}
        onMouseLeave={() => handleHoverItem(undefined)}
        onClick={() => handleClickItem(data.identifier, data.isPartOf)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row"
          }}
        >
          <div
            style={{
              width: "1.5rem",
              fontWeight: "bold",
              backgroundColor: "grey",
              color: "white",
              borderRadius: "0.3rem",
              opacity: 0.6
            }}
          >
            {index + 1}.
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: "bold", wordBreak: "break-all" }}>
              <ResultItemContent platform={platform} type={type} data={data} />
            </div>{" "}
            <div
              className="tags"
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                margin: "0.2rem"
              }}
            >
              <LinkTag
                fetchStep={fetchStep}
                nrOfLinks={data.isPartOf ? data.isPartOf.length : 0}
              />
              <SourceTag fetchStep={fetchStep} data={data} />
              <OriginalSourceTag platform={platform} type={type} data={data} />
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

export default ResultItem;
