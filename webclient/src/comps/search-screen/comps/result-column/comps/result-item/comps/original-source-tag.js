import React from "react";
import { LinkOutlined } from "@ant-design/icons";
import _ from "lodash";
import { Tag } from "antd";

const OriginalSourceTag = ({ data, platform, type }) => {
  const urls = {
    REPOSITUM: {
      PROJECT: `https://explore.openaire.eu/search/publication?articleId=${_.get(
        data,
        "result.header.dri:objIdentifier"
      )}`
    },
    INVENIO: {
      PROJECT: _.get(data, "doi_url")
    },
    GITHUB: {
      PROJECT: _.get(data, "html_url"),
      PERSON: _.get(data, "html_url")
    },
    GITLAB: {
      PROJECT: _.get(data, "web_url"),
      PERSON: _.get(data, "web_url")
    },
    TISS: {
      PROJECT: `https://tiss.tuwien.ac.at/fpl/project/index.xhtml?id=${_.get(
        data,
        "projectId"
      )}`,
      PERSON: `https://tiss.tuwien.ac.at/${_.get(data, "card_uri")}`
    }
  };

  const url = urls[platform][type];

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
