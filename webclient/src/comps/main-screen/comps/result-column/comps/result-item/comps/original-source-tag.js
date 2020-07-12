import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import { Tag } from "antd";

const OriginalSourceTag = ({ data, platform, type }) => {
  const url = data.originalSourceUrl;

  return (
    <Tag
      style={{
        fontWeight: "bold"
      }}
      title={"Click to visit original source..."}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
      >
        <LinkOutlined />
      </a>
    </Tag>
  );
};

export default OriginalSourceTag;
