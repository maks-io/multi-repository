import React, { Component } from "react";
import { Card } from "antd";
import LinkTag from "./comps/link-tag";
import SourceTag from "./comps/source-tag";
import OriginalSourceTag from "./comps/original-source-tag";
import ResultItemTitleAndHeader from "./comps/result-item-title-and-header";
import { constants } from "../../../../../../constants";
import { colors } from "../../../../../../colors";
import { ArcherContainer, ArcherElement } from "react-archer";

class ResultItem extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {
      loadingStep: loadingStepNew,
      mode: modeNew,
      focusInfo: focusInfoNew,
      linkTagStatus: linkTagStatusNew,
      isHighlighted: isHighlightedNew,
      hoverStyle: hoverStyleNew
    } = nextProps;

    const {
      loadingStep,
      mode,
      focusInfo,
      linkTagStatus,
      isHighlighted,
      hoverStyle
    } = this.props;

    if (
      JSON.stringify(loadingStepNew) !== JSON.stringify(loadingStep) ||
      JSON.stringify(modeNew) !== JSON.stringify(mode) ||
      JSON.stringify(focusInfoNew) !== JSON.stringify(focusInfo) ||
      JSON.stringify(linkTagStatusNew) !== JSON.stringify(linkTagStatus) ||
      JSON.stringify(isHighlightedNew) !== JSON.stringify(isHighlighted) ||
      JSON.stringify(hoverStyleNew) !== JSON.stringify(hoverStyle)
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
      fetchStep,
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
      hoverStyle
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

    if (data.isPartOf.length > 0) {
      console.log("le link data", data);
    }
    // console.log("identifier", identifier);

    const relations = data.isPartOf
      .map(p => {
        const linkNodes = p.split(":::::");
        const nodeOneIdentifier = linkNodes[0];
        const nodeTwoIdentifier = linkNodes[1];
        console.log("le link nodes are", linkNodes);
        console.log("le link idenfier is", identifier);
        if (nodeOneIdentifier === identifier) {
          console.log("le link HIIIIIII", identifier);
          return {
            targetId: nodeTwoIdentifier,
            targetAnchor: "top",
            sourceAnchor: "bottom",
            style: { strokeColor: "blue", strokeWidth: 1 },
            label: <div style={{ marginTop: "-20px" }}>Arrow 2</div>
          };
        }
      })
      .filter(x => Boolean(x));
    console.log("le relations are", relations);

    return (
      <div style={{ display: "flex", justifyContent: "flex" }}>
        <ArcherElement id={identifier} relations={relations}>
          <Card
            size="small"
            style={{
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
              title={`my identifier is: ${identifier}`}
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
                    linkTagStatus={linkTagStatus}
                  />
                  <SourceTag fetchStep={fetchStep} data={data} />
                  <OriginalSourceTag
                    platform={platform}
                    type={type}
                    data={data}
                  />
                </div>
              </div>
            </div>
          </Card>
        </ArcherElement>
      </div>
    );
  }
}

export default ResultItem;
