import React, { Component } from "react";
import { Card, Icon } from "antd";
import ResultItem from "./comps/result-item";
import ResultColumnHeader from "./comps/result-column-header";
import { constants } from "../../../../constants";
import { colors } from "../../../../colors";
import LineTo from "react-lineto";

const HOVER_DIRECT_COLOR = colors.BlueMunsell;
const HOVER_INDIRECT_COLOR = colors.Silver;

class ResultColumn extends Component {
  render() {
    const {
      loadingStep,
      platform,
      type,
      logoUrl,
      fallbackAvatar,
      items,
      isLoading,
      handleHoverItem,
      hoverInfo,
      handleClickItem,
      focusInfo,
      linkEditInfo,
      columnWidth,
      mode,
      handleRemoveLinkConfirm,
      handleAddLinkConfirm,
      handleLinkTagClick,
      relationships
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
                        i.isPartOf.some(r => hoverInfo.linkIds.includes(r.link))
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

                    const relations = i.isPartOf
                      .map(p => {
                        const linkNodes = p.link.split(":::::");
                        const nodeOneIdentifier = linkNodes[0];
                        const nodeTwoIdentifier = linkNodes[1];

                        if (nodeOneIdentifier === i.identifier) {
                          const { relationship: r } = p;
                          const relationship = relationships[r];
                          const { color } = relationship;

                          return {
                            targetId: nodeTwoIdentifier,
                            targetAnchor: "top",
                            sourceAnchor: "bottom",
                            color,
                            style: { strokeColor: color, strokeWidth: 1 },
                            label: (
                              <div style={{ marginTop: "-20px" }}>Arrow 2</div>
                            )
                          };
                        }
                      })
                      .filter(x => Boolean(x));

                    return (
                      <div>
                        <ResultItem
                          loadingStep={loadingStep}
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
                          handleLinkTagClick={handleLinkTagClick}
                          handleRemoveLinkConfirm={handleRemoveLinkConfirm}
                          handleAddLinkConfirm={handleAddLinkConfirm}
                          linkTagStatus={linkTagStatus}
                          isHighlighted={isHighlighted}
                          hoverStyle={hoverStyle}
                          relationships={relationships}
                        />
                        {relations.map(r => (
                          <LineTo
                            from={`card-for-${i.identifier}`}
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
                        ))}
                      </div>
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
