import React from "react";
import { Spin, Tag, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { NodeIndexOutlined } from "@ant-design/icons/lib/icons";
import { DeleteOutlined } from "@ant-design/icons/lib/icons";
import SyncOutlined from "@ant-design/icons/lib/icons/SyncOutlined";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/lib/icons/CheckCircleOutlined";

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
  const {
    fetchStep,
    nrOfLinks,
    handleLinkTagClick,
    identifier,
    linkEditInfo,
    isPartOf,
    handleRemoveLinkConfirm
  } = props;

  const title =
    fetchStep === -1
      ? `This item has ${nrOfLinks} link(s).\nClick to add more links or delete existing ones...`
      : fetchStep === 0
      ? "Links not fetched yet - please wait..."
      : "Fetching links - please wait...";
  const opacity =
    fetchStep === 0 || (fetchStep === -1 && nrOfLinks === 0) ? 0.5 : 1;

  const linkTagStatus =
    identifier === linkEditInfo.activeIdentifier
      ? "ACTIVE"
      : linkEditInfo.linkedItemsIdentifiers &&
        isPartOf.some(r => linkEditInfo.linkedItemsIdentifiers.includes(r))
      ? "LINKED_ITEM"
      : "STANDARD";

  return (
    <Tag
      style={{
        fontWeight: "bold",
        cursor: "pointer",
        color:
          linkTagStatus === "LINKED_ITEM"
            ? "red"
            : linkTagStatus === "ACTIVE"
            ? "blue"
            : "black",
        backgroundColor:
          linkTagStatus === "LINKED_ITEM"
            ? "coral"
            : linkTagStatus === "ACTIVE"
            ? "lightblue"
            : "white",
        opacity
      }}
      title={
        linkTagStatus === "LINKED_ITEM"
          ? "Click to remove link..."
          : linkTagStatus === "ACTIVE"
          ? `You are editing these links. There are currently ${nrOfLinks} other items linked to this item. Search for new items above to link more, or delete existing links.`
          : title
      }
      onClick={e => {
        e.stopPropagation();
        if (linkTagStatus !== "LINKED_ITEM") {
          handleLinkTagClick(identifier, isPartOf);
        }
      }}
    >
      {(linkTagStatus === "STANDARD" || linkTagStatus === "ACTIVE") && (
        <>
          <NodeIndexOutlined />{" "}
          <Indicator fetchStep={fetchStep} nrOfLinks={nrOfLinks} />
        </>
      )}
      {linkTagStatus === "LINKED_ITEM" && (
        <Popconfirm
          title="Do you really want to remove this link?"
          onConfirm={handleRemoveLinkConfirm}
          onCancel={null}
          okText="Yes"
          cancelText="No"
          placement="bottom"
        >
          <NodeIndexOutlined /> <DeleteOutlined />
        </Popconfirm>
      )}
    </Tag>
  );
};

export default LinkTag;
