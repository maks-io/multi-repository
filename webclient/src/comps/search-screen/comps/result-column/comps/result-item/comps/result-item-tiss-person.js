import React from "react";
import _ from "lodash";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const ResultItemTissPerson = ({ data }) => {
  const fullName = _.get(data, `first_name`) + " " + _.get(data, `last_name`);
  const baseUrl = "https://tiss.tuwien.ac.at";
  const pictureSrc = _.get(data, `picture_uri`)
  const avatarSrc = `${baseUrl}/${pictureSrc}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center"
      }}
    >
      {fullName}
      {pictureSrc && <Avatar size={64} src={avatarSrc} />}
      {!pictureSrc && <Avatar size={64} icon={<UserOutlined />} />}
    </div>
  );
};

export default ResultItemTissPerson;
