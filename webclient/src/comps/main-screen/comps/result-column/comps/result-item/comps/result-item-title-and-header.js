import React from "react";
import { Avatar } from "antd";
import _ from "lodash";

const ResultItemTitleAndHeader = ({ data, fallbackAvatar }) => {
  const { resultStructure } = data;
  const title = _.get(data, resultStructure.title);
  const avatar = _.get(data, resultStructure.avatar);

  const FallbackIcon = require("@ant-design/icons")[fallbackAvatar];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center"
      }}
    >
      {title}
      {avatar && <Avatar size={64} src={avatar} />}
      {!avatar && fallbackAvatar && (
        <Avatar size={64} icon={<FallbackIcon />} />
      )}
    </div>
  );
};

export default ResultItemTitleAndHeader;
