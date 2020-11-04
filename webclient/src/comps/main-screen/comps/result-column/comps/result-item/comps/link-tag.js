import React, { useState } from "react";
import { Popconfirm, Spin, Tag, Modal, Radio } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { DeleteOutlined, NodeIndexOutlined } from "@ant-design/icons/lib/icons";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { colors } from "../../../../../../../colors";

const antIcon = (
  <LoadingOutlined
    style={{ fontSize: 12, margin: 0, fontWeight: "bold" }}
    spin
  />
);

const Indicator = props => {
  const { loadingStep, nrOfLinks } = props;

  if (loadingStep === 0) {
    return <span>?</span>;
  } else if (loadingStep === 1) {
    return <Spin indicator={antIcon} size={"small"} style={{ margin: 0 }} />;
  } else {
    return <span>{nrOfLinks}</span>;
  }
};

const LinkTag = props => {
  const {
    loadingStep,
    nrOfLinks,
    handleLinkTagClick,
    identifier,
    linkEditInfo,
    isPartOf,
    handleRemoveLinkConfirm,
    handleAddLinkConfirm,
    linkTagStatus,
    relationships
  } = props;

  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [relationship, setRelationship] = useState(
    Object.keys(relationships)[0]
  );

  if (linkTagStatus === "STANDARD") {
    const opacity =
      loadingStep === 0 || (loadingStep === -1 && nrOfLinks === 0) ? 0.5 : 1;
    const title =
      loadingStep === -1
        ? `This item has ${nrOfLinks} link(s).\nClick to add more links or delete existing ones...`
        : loadingStep === 0
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
          <Indicator loadingStep={loadingStep} nrOfLinks={nrOfLinks} />
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
          color: colors.EditLinksDark,
          backgroundColor: colors.EditLinks
        }}
        title={`You are currently editing links for this item. Click to exit this linking mode.`}
        onClick={e => {
          e.stopPropagation();
          handleLinkTagClick(identifier, isPartOf);
        }}
      >
        <>
          <NodeIndexOutlined />{" "}
          <Indicator loadingStep={loadingStep} nrOfLinks={nrOfLinks} />
        </>
      </Tag>
    );
  }

  if (linkTagStatus === "LINKED_ITEM") {
    return (
      <Popconfirm
        title="Do you really want to remove this link?"
        onConfirm={event => {
          const linkIdsOfActiveElement = linkEditInfo.linkIds;
          const linkIdsOfClickedElement = isPartOf.map(l => l.link);
          const linkId = linkIdsOfActiveElement.filter(value =>
            linkIdsOfClickedElement.includes(value)
          )[0];
          handleRemoveLinkConfirm(identifier, linkId);
          event.stopPropagation();
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
            color: colors.RemoveLinkDark,
            backgroundColor: colors.RemoveLink
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
      <React.Fragment
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
            color: colors.AddLinkDark,
            backgroundColor: colors.AddLink
          }}
          title={"Click to add link..."}
          onClick={e => {
            e.stopPropagation();
            setShowNewLinkModal(true);
          }}
        >
          <NodeIndexOutlined /> <PlusOutlined />
        </Tag>
        <Modal
          title={"Create new link..."}
          visible={showNewLinkModal}
          onOk={e => {
            console.log("on ok", e);
            handleAddLinkConfirm(e, identifier, relationship);
          }}
          onCancel={() => {
            setShowNewLinkModal(false);
          }}
        >
          <Radio.Group
            buttonStyle={"solid"}
            onChange={e => {
              setRelationship(e.target.value);
            }}
          >
            {Object.keys(relationships).map(r => {
              const rship = relationships[r];
              return (
                <Radio.Button value={r} checked={r === relationship}>
                  {rship.title}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Modal>
      </React.Fragment>
    );
  }
};

export default LinkTag;
