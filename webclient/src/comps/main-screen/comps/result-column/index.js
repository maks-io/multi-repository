import React, { Component } from "react";
import { Icon } from "antd";
import ResultItem from "./comps/result-item";
import ResultColumnHeader from "./comps/result-column-header";
import { constants } from "../../../../constants";
import { colors } from "../../../../colors";

const HOVER_DIRECT_COLOR = colors.BlueMunsell;
const HOVER_INDIRECT_COLOR = colors.Silver;

class ResultColumn extends Component {
  render() {
    const {
      platform,
      type,
      logoUrl,
      fallbackAvatar,
      items,
      isLoading,
      fetchStep,
      handleHoverItem,
      hoverInfo,
      handleClickItem,
      focusInfo,
      linkEditInfo,
      columnWidth,
      mode,
      handleRemoveLinkConfirm,
      handleAddLinkConfirm,
      handleLinkTagClick
    } = this.props;

    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            width: columnWidth
          }}
        >
          <ResultColumnHeader
            logoUrl={logoUrl}
            platform={platform}
            type={type}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              {isLoading ? <Icon type="loading" /> : <Icon type="check" />}
            </div>
            {isLoading ? (
              <h3> </h3>
            ) : (
              <React.Fragment>
                <h3
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    opacity: focusInfo.identifier && 0.25
                  }}
                >
                  {items.length} item(s) found
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1
                  }}
                >
                  {items.map((i, index) => {
                    let hoverStyle = {};
                    if (
                      Boolean(hoverInfo.identifier) &&
                      hoverInfo.identifier === i.identifier
                    ) {
                      hoverStyle.backgroundColor = HOVER_DIRECT_COLOR;
                      hoverStyle.color = "white";
                    } else if (hoverInfo.linkIds) {
                      if (
                        i.isNew &&
                        hoverInfo.linkIds.includes(i.isPartOf[0])
                      ) {
                        hoverStyle.backgroundColor = HOVER_INDIRECT_COLOR;
                      } else if (
                        i.isPartOf.some(r => hoverInfo.linkIds.includes(r))
                      ) {
                        hoverStyle.backgroundColor = HOVER_INDIRECT_COLOR;
                      }
                    }

                    const isHighlighted =
                      (mode === constants.mode.FOCUS &&
                        focusInfo.identifier === i.identifier) ||
                      (mode === constants.mode.EDIT_LINKS &&
                        linkEditInfo.identifier === i.identifier);

                    const linkEditModeActive =
                      mode === constants.mode.EDIT_LINKS;
                    const linkTagStatus = !linkEditModeActive
                      ? "STANDARD"
                      : i.identifier === linkEditInfo.activeIdentifier
                      ? "ACTIVE"
                      : linkEditInfo.linkedItemsIdentifiers &&
                        linkEditInfo.linkedItemsIdentifiers.includes(
                          i.identifier
                        )
                      ? "LINKED_ITEM"
                      : "POTENTIAL_LINK";
                    return (
                      <ResultItem
                        key={i.identifier}
                        data={i}
                        index={index}
                        mode={mode}
                        platform={platform}
                        type={type}
                        identifier={i.identifier}
                        fallbackAvatar={fallbackAvatar}
                        handleHoverItem={handleHoverItem}
                        hoverInfo={hoverInfo}
                        handleClickItem={handleClickItem}
                        focusInfo={focusInfo}
                        linkEditInfo={linkEditInfo}
                        fetchStep={fetchStep}
                        handleLinkTagClick={handleLinkTagClick}
                        handleRemoveLinkConfirm={handleRemoveLinkConfirm}
                        handleAddLinkConfirm={handleAddLinkConfirm}
                        linkTagStatus={linkTagStatus}
                        isHighlighted={isHighlighted}
                        hoverStyle={hoverStyle}
                      />
                    );
                  })}
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ResultColumn;
