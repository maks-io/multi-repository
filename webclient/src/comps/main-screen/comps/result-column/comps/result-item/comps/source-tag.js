import React from "react";
import { Tag } from "antd";
import { GoldFilled } from "@ant-design/icons";

const SourceTag = props => {
  const { laodingStep, data } = props;

  const stepNr =
    laodingStep === 0
      ? "1"
      : data.isNew && data.isOld
      ? "1+2"
      : data.isNew
      ? "2"
      : "1";

  return (
    <Tag
      style={{
        fontWeight: "bold"
      }}
    >
      <GoldFilled /> Step {stepNr}
    </Tag>
  );
};

export default SourceTag;
