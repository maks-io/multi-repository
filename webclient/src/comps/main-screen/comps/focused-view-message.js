import React from "react";
import { Button } from "antd";

const FocusedViewMessage = props => {
  const { leave, currentItemHasLinks } = props;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <h1>Focused View</h1>
      {!currentItemHasLinks && <div>Note: the selected item has 0 links!</div>}
      <Button type="link" size="small" onClick={leave}>
        leave
      </Button>
    </div>
  );
};

export default FocusedViewMessage;
