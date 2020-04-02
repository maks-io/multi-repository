import React from "react";
import _ from "lodash";

const ResultItemTissProject = ({ data }) => {
  const title = _.get(data, `titleEn`);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {title}
    </div>
  );
};

export default ResultItemTissProject;
