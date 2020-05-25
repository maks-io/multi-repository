import React, { Component } from "react";
import { Icon } from "antd";
import ResultItem from "./comps/result-item";
import ResultColumnHeader from "./comps/result-column-header";

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
          <ResultColumnHeader logoUrl={logoUrl} type={type} />
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
                  {items.map((i, index) => (
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
                    />
                  ))}
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
