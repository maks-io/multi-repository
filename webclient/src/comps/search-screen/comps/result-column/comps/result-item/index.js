import React, { Component } from "react";
import { Card } from "antd";
import LinkTag from "./comps/link-tag";
import SourceTag from "./comps/source-tag";
import OriginalSourceTag from "./comps/original-source-tag";
import ResultItemTitleAndHeader from "./comps/result-item-title-and-header";
import { constants } from "../../../../../../constants";

const HOVER_DIRECT_COLOR = "#9DB4C0";
const HOVER_INDIRECT_COLOR = "#C2DFE3";

class ResultItem extends Component {
  render() {
    const {
      resultStructure,
      data,
      fallbackAvatar,
      fetchStep,
      index,
      platform,
      type,
      identifier,
      handleLinkTagClick,
      handleHoverItem,
      hoverInfo,
      handleClickItem,
      focusInfo,
      linkEditInfo,
      handleRemoveLinkConfirm,
      handleAddLinkConfirm,
      mode
    } = this.props;

    if (mode === constants.mode.FOCUS) {
      // some item is focused!
      if (focusInfo.linkIds.length === 0) {
        if (focusInfo.identifier !== data.identifier) {
          return null;
        }
      } else if (!data.isPartOf.some(r => focusInfo.linkIds.includes(r))) {
        return null;
      }
    }

    let hoverStyle = {};
    if (
      Boolean(hoverInfo.identifier) &&
      hoverInfo.identifier === data.identifier
    ) {
      hoverStyle.backgroundColor = HOVER_DIRECT_COLOR;
    } else if (hoverInfo.linkIds) {
      if (data.isNew && hoverInfo.linkIds.includes(data.isPartOf[0])) {
        hoverStyle.backgroundColor = HOVER_INDIRECT_COLOR;
      } else if (data.isPartOf.some(r => hoverInfo.linkIds.includes(r))) {
        hoverStyle.backgroundColor = HOVER_INDIRECT_COLOR;
      }
    }

    const isHighlighted =
      (mode === constants.mode.FOCUS && focusInfo.identifier === data.identifier) ||
      (mode === constants.mode.EDIT_LINKS && linkEditInfo.identifier === data.identifier);

    return (
      <Card
        size="small"
        style={{
          borderRadius: "0.5rem",
          margin: "0.3rem",
          cursor: "pointer",
          borderWidth: 7,
          borderColor: isHighlighted ? "green" : "transparent",
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
              alignItems: "center"
            }}
          >
            <div style={{ fontWeight: "bold", wordBreak: "break-all" }}>
              <ResultItemTitleAndHeader
                resultStructure={resultStructure}
                platform={platform}
                type={type}
                data={data}
                fallbackAvatar={fallbackAvatar}
              />
            </div>
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
                linkEditModeActive={mode === constants.mode.EDIT_LINKS}
                fetchStep={fetchStep}
                nrOfLinks={data.isPartOf ? data.isPartOf.length : 0}
                platform={platform}
                type={type}
                identifier={identifier}
                handleLinkTagClick={handleLinkTagClick}
                linkEditInfo={linkEditInfo}
                isPartOf={data.isPartOf}
                handleRemoveLinkConfirm={handleRemoveLinkConfirm}
                handleAddLinkConfirm={handleAddLinkConfirm}
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
