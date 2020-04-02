import React from "react";

const ResultColumnHeader = ({ platform, type }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "7rem",
        marginBottom: "1rem"
      }}
    >
      <ResultColumnLogo platform={platform} type={type} />
      <ResultColumnTitle platform={platform} type={type} />
    </div>
  );
};

export default ResultColumnHeader;

const ResultColumnTitle = ({ platform, type }) => {
  const titles = {
    REPOSITUM: {
      PROJECT: undefined
    },
    INVENIO: {
      PROJECT: undefined
    },
    GITHUB: {
      PROJECT: "Repositories",
      PERSON: "Users"
    },
    GITLAB: {
      PROJECT: "Repositories",
      PERSON: "Users"
    },
    TISS: {
      PROJECT: "Projects",
      PERSON: "People"
    }
  };

  const title = titles[platform][type];
  return title ? (
    <h3 style={{ height: "1rem", fontWeight: "bold" }}>{title}</h3>
  ) : null;
};

const ResultColumnLogo = ({ platform, type }) => {
  const logoPaths = {
    REPOSITUM: {
      PROJECT: "http://repositum.tuwien.ac.at/domainimage/hostedbyrepositum_150"
    },
    INVENIO: {
      PROJECT: "https://invenio-software.org/static/img/logo-invenio-white.svg"
    },
    GITHUB: {
      PROJECT:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png",
      PERSON:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png"
    },
    GITLAB: {
      PROJECT:
        "https://about.gitlab.com/images/press/logo/png/gitlab-logo-gray-rgb.png",
      PERSON:
        "https://about.gitlab.com/images/press/logo/png/gitlab-logo-gray-rgb.png"
    },
    TISS: {
      PROJECT:
        "https://www.tiss.tuwien.ac.at/static/2.5.2/global/images/tiss_logo.png",
      PERSON:
        "https://www.tiss.tuwien.ac.at/static/2.5.2/global/images/tiss_logo.png"
    }
  };

  const logoPath = logoPaths[platform][type];
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
        src={logoPath}
        style={{ maxWidth: "100%", maxHeight: "4rem" }}
        alt="platformLogo"
      />
    </div>
  );
};
