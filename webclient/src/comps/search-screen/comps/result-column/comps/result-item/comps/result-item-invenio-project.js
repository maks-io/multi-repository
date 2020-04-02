import React from "react";
import _ from "lodash";

const ResultItemInvenioProject = ({ data }) => {
  const title = _.get(data, `title`);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {title}
    </div>
  );
};

export default ResultItemInvenioProject;
