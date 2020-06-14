import React from "react";
import { Popconfirm, Spin, Tag } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { DeleteOutlined, NodeIndexOutlined } from "@ant-design/icons/lib/icons";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

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
    linkEditModeActive,
    fetchStep,
    nrOfLinks,
    handleLinkTagClick,
    identifier,
    linkEditInfo,
    isPartOf,
    handleRemoveLinkConfirm,
    handleAddLinkConfirm
  } = props;

  const linkTagStatus = !linkEditModeActive
    ? "STANDARD"
    : identifier === linkEditInfo.activeIdentifier
    ? "ACTIVE"
    : linkEditInfo.linkedItemsIdentifiers &&
      linkEditInfo.linkedItemsIdentifiers.includes(identifier)
    ? "LINKED_ITEM"
    : "POTENTIAL_LINK";

  if (linkTagStatus === "STANDARD") {
    const opacity =
      fetchStep === 0 || (fetchStep === -1 && nrOfLinks === 0) ? 0.5 : 1;
    const title =
      fetchStep === -1
        ? `This item has ${nrOfLinks} link(s).\nClick to add more links or delete existing ones...`
        : fetchStep === 0
        ? "Links not fetched yet - please wait..."
        : "Fetching links - please wait...";

    return (
      <Tag
        style={{
          fontWeight: "bold",
          cursor: "pointer",
          color: "black",
          backgroundColor: "white",
          opacity
        }}
        title={title}
        onClick={e => {
          e.stopPropagation();
          handleLinkTagClick(identifier, isPartOf);
        }}
      >
        <>
          <NodeIndexOutlined />{" "}
          <Indicator fetchStep={fetchStep} nrOfLinks={nrOfLinks} />
        </>
      </Tag>
    );
  }

  if (linkTagStatus === "ACTIVE") {
    return (
      <Tag
        style={{
          fontWeight: "bold",
          cursor: "pointer",
          color: "blue",
          backgroundColor: "lightblue"
        }}
        title={`You are currently editing links for this item. Click to exit this linking mode.`}
        onClick={e => {
          e.stopPropagation();
          handleLinkTagClick(identifier, isPartOf);
        }}
      >
        <>
          <NodeIndexOutlined />{" "}
          <Indicator fetchStep={fetchStep} nrOfLinks={nrOfLinks} />
        </>
      </Tag>
    );
  }

  if (linkTagStatus === "LINKED_ITEM") {
    return (
      <Popconfirm
        title="Do you really want to remove this link?"
        onConfirm={() => {
          const linkIdsOfActiveElement = linkEditInfo.linkIds;
          const linkIdsOfClickedElement = isPartOf;
          const linkId = linkIdsOfActiveElement.filter(value =>
            linkIdsOfClickedElement.includes(value)
          )[0];
          handleRemoveLinkConfirm(identifier, linkId);
        }}
        onCancel={null}
        okText="Yes"
        cancelText="No"
        placement="bottom"
      >
        <Tag
          style={{
            fontWeight: "bold",
            cursor: "pointer",
            color: "red",
            backgroundColor: "coral"
          }}
          title={"Click to remove link..."}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <NodeIndexOutlined /> <DeleteOutlined />
        </Tag>
      </Popconfirm>
    );
  }

  if (linkTagStatus === "POTENTIAL_LINK") {
    return (
      <Popconfirm
        title="Do you really want to add this link?"
        onConfirm={e => handleAddLinkConfirm(e, identifier)}
        onCancel={null}
        okText="Yes"
        cancelText="No"
        placement="bottom"
      >
        <Tag
          style={{
            fontWeight: "bold",
            cursor: "pointer",
            color: "green",
            backgroundColor: "lightgreen"
          }}
          title={"Click to add link..."}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <NodeIndexOutlined /> <PlusOutlined />
        </Tag>
      </Popconfirm>
    );
  }
};

export default LinkTag;
