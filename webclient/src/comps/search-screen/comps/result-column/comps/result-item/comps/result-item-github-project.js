import React from "react";
import _ from "lodash";

const ResultItemGithubProject = ({ data }) => {
  const title = _.get(data, `name`);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {title}
    </div>
  );
};

export default ResultItemGithubProject;
