import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import _ from "lodash";

const ResultItemGithubPerson = ({ data }) => {
  const title = _.get(data, `login`);
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
      {avatarSrc && <Avatar size={64} src={avatarSrc} />}
      {!avatarSrc && <Avatar size={64} icon={<UserOutlined />} />}
    </div>
  );
};

export default ResultItemGithubPerson;
