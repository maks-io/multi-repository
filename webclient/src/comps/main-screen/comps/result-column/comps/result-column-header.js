import React from "react";

const ResultColumnHeader = ({ logoUrl, platform, type }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "7rem",
        marginBottom: "1rem"
      }}
    >
      <ResultColumnLogo platform={platform} logoUrl={logoUrl} />
      <ResultColumnTitle type={type} />
    </div>
  );
};

export default ResultColumnHeader;

const ResultColumnTitle = ({ type }) => {
  return type ? (
    <h3 style={{ height: "1rem", fontWeight: "bold", opacity: 0.8 }}>{type}</h3>
  ) : null;
};

const ResultColumnLogo = ({ platform, logoUrl }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        paddingBottom: 0,
        height: "6rem"
      }}
    >
      <img
        src={logoUrl}
        style={{ maxWidth: "100%", maxHeight: "4rem" }}
        alt={`logoForPlatform${platform}`}
      />
    </div>
  );
};
