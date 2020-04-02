import React from "react";
import _ from "lodash";
import { Avatar } from "antd";

const ResultItemGitlabPerson = ({ data }) => {
  const title = _.get(data, `name`);
  const avatarSrc = _.get(data, "avatar_url");

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
      <Avatar size={64} src={avatarSrc} />
    </div>
  );
};

export default ResultItemGitlabPerson;
