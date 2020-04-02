import React, { Component } from "react";
import { Icon } from "antd";
import ResultItem from "./comps/result-item";
import ResultColumnHeader from "./comps/result-column-header";
import { createIdentifier } from "../../../../services/create-identifier";

class ResultColumn extends Component {
  render() {
    const {
      platform,
      type,
      items,
      isLoading,
      fetchStep,
      handleHoverItem,
      hoverInfo,
      handleClickItem,
      focusInfo,
      haveResults,
      columnWidth
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
          <ResultColumnHeader platform={platform} type={type} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              opacity: !haveResults && 0.5
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
                    opacity: focusInfo.identifier && "0.25"
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
                      key={createIdentifier(platform, type, index)} // this is a dummy identifier
                      data={i}
                      index={index}
                      platform={platform}
                      type={type}
                      handleHoverItem={handleHoverItem}
                      hoverInfo={hoverInfo}
                      handleClickItem={handleClickItem}
                      focusInfo={focusInfo}
                      fetchStep={fetchStep}
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
