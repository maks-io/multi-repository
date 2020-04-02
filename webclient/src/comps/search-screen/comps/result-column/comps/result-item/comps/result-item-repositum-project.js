import React from "react";
import _ from "lodash";

const ResultItemRepositumProject = ({ data }) => {

  const title = _.get(
    data,
    `result.metadata["oaf:entity"]["oaf:result"].title.content`
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {title}
    </div>
  );
};

export default ResultItemRepositumProject;
