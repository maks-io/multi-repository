import React from "react";
import { Spin, Tag } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import NodeIndexOutlined from "@ant-design/icons/lib/icons/NodeIndexOutlined";

const antIcon = (
  <LoadingOutlined
    style={{ fontSize: 12, margin: 0, fontWeight: "bold" }}
    spin
  />
);

const Indicator = props => {
  const { fetchStep, nrOfLinks } = props;

  if (fetchStep === 0) {
    return <span>?</span>;
  } else if (fetchStep === 1) {
    return <Spin indicator={antIcon} size={"small"} style={{ margin: 0 }} />;
  } else {
    return <span>{nrOfLinks}</span>;
  }
};

const LinkTag = props => {
  const { fetchStep, nrOfLinks } = props;

  const title =
    fetchStep === -1
      ? `This item has ${nrOfLinks} link(s).`
      : fetchStep === 0
      ? "Links not fetched yet - please wait..."
      : "Fetching links - please wait...";
  const opacity =
    fetchStep === 0 || (fetchStep === -1 && nrOfLinks === 0) ? 0.5 : 1;

  return (
    <Tag
      style={{
        fontWeight: "bold",
        opacity
      }}
      title={title}
    >
      <NodeIndexOutlined />{" "}
      <Indicator fetchStep={fetchStep} nrOfLinks={nrOfLinks} />
    </Tag>
  );
};

export default LinkTag;
