import React, { Component } from "react";
import LineTo from "react-lineto";
import { Card } from "antd";
import LinkTag from "./comps/link-tag";
import SourceTag from "./comps/source-tag";
import OriginalSourceTag from "./comps/original-source-tag";
import ResultItemTitleAndHeader from "./comps/result-item-title-and-header";
import { constants } from "../../../../../../constants";
import { colors } from "../../../../../../colors";

class ResultItem extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {
      loadingStep: loadingStepNew,
      mode: modeNew,
      focusInfo: focusInfoNew,
      linkTagStatus: linkTagStatusNew,
      isHighlighted: isHighlightedNew,
      hoverStyle: hoverStyleNew,relationships:relationshipsNew
    } = nextProps;

    const {
      loadingStep,
      mode,
      focusInfo,
      linkTagStatus,
      isHighlighted,
      hoverStyle,relationships
    } = this.props;

    if (
      JSON.stringify(loadingStepNew) !== JSON.stringify(loadingStep) ||
      JSON.stringify(modeNew) !== JSON.stringify(mode) ||
      JSON.stringify(focusInfoNew) !== JSON.stringify(focusInfo) ||
      JSON.stringify(linkTagStatusNew) !== JSON.stringify(linkTagStatus) ||
      JSON.stringify(isHighlightedNew) !== JSON.stringify(isHighlighted) ||
      JSON.stringify(hoverStyleNew) !== JSON.stringify(hoverStyle)||
      JSON.stringify(relationshipsNew) !== JSON.stringify(relationships)
    ) {
      return true;
    }
    return false;
  }

  render() {
    const {
      isLoading,
      resultStructure,
      data,
      fallbackAvatar,
      index,
      platform,
      type,
      identifier,
      handleLinkTagClick,
      handleHoverItem,
      handleClickItem,
      focusInfo,
      linkEditInfo,
      handleRemoveLinkConfirm,
      handleAddLinkConfirm,
      mode,
      linkTagStatus,
      isHighlighted,
      hoverStyle,
      relationships,
      loadingStep
    } = this.props;

    console.log("data.ispartof",data.isPartOf)
    console.log("focusInfo.linkIds",focusInfo.linkIds)

    if (mode === constants.mode.FOCUS) {
      // some item is focused!
      if (focusInfo.linkIds.length === 0) {
        if (focusInfo.identifier !== data.identifier) {
          return null;
        }
      } else if (!data.isPartOf.some(r => focusInfo.linkIds.includes(r.link))) {
        return null;
      }
    }

    if (data.isPartOf.length > 0) {
      console.log("le link data", data);
    }
    // console.log("identifier", identifier);


    // console.log("le relations are", relations);

    return (
      <div style={{ display: "flex", justifyContent: "flex" }}>
        <Card
          className={`card-for-${identifier}`}
          size="small"
          style={{
            zIndex: 2,
            borderRadius: "0.5rem",
            margin: "0.3rem",
            cursor: "pointer",
            borderWidth: 7,
            borderColor: isHighlighted
              ? colors.Focus
              : linkTagStatus === "ACTIVE"
              ? colors.EditLinks
              : linkTagStatus === "POTENTIAL_LINK"
              ? colors.AddLink
              : linkTagStatus === "LINKED_ITEM"
              ? colors.RemoveLink
              : "transparent",
            ...hoverStyle
          }}
          bodyStyle={{ padding: "0.3rem" }}
          onMouseEnter={() => handleHoverItem(data.identifier, data.isPartOf)}
          onMouseLeave={() => handleHoverItem(undefined)}
          onClick={() => handleClickItem(data.identifier, data.isPartOf)}
        >
          <div
            title={`my identifier is: ${identifier}`} // TODO
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
                  loadingStep={loadingStep}
                  nrOfLinks={data.isPartOf ? data.isPartOf.length : 0}
                  platform={platform}
                  type={type}
                  identifier={identifier}
                  handleLinkTagClick={handleLinkTagClick}
                  linkEditInfo={linkEditInfo}
                  isPartOf={data.isPartOf}
                  handleRemoveLinkConfirm={handleRemoveLinkConfirm}
                  handleAddLinkConfirm={handleAddLinkConfirm}
                  linkTagStatus={linkTagStatus}
                  relationships={relationships}
                />
                <SourceTag loadingStep={loadingStep} data={data} />
                <OriginalSourceTag
                  platform={platform}
                  type={type}
                  data={data}
                />
              </div>
            </div>
          </div>
        </Card>{/*
        {relations.map(r => (
          <LineTo
            from={`card-for-${identifier}`}
            to={`card-for-${r.targetId}`}
            borderWidth={5}
            borderColor={r.color}
            onClick={() => {
              console.log("test clisck");
            }}
            onMouseEnter={() => {
              console.log("onMouseEnter");
            }}
            onMouseLeave={() => {
              console.log("onMouseLeave");
            }}
          />
        ))}*/}
      </div>
    );
  }
}

export default ResultItem;
