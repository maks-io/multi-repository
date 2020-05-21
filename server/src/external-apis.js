const externalApiConfig = {
  GITHUB: {
    PERSON: {
      LOGO_URL:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png",
      FALLBACK_AVATAR: "UserOutlined",
      SEARCH_BY_TERM: {
        QUERY: {
          URL: "https://api.github.com/search/users?q=[SEARCH_TERM]"
        },
        RESULT: {
          PATH: "items",
          STRUCTURE: { id: "id", title: "login", avatar: "avatar_url" }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://api.github.com/users/[ID]"
        },
        RESULT: {
          PATH: "items",
          STRUCTURE: { id: "id", title: "login", avatar: "avatar_url" }
        }
      }
    },
    PROJECT: {
      LOGO_URL:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png",
      SEARCH_BY_TERM: {
        QUERY: {
          URL: "https://api.github.com/search/repositories?q=[SEARCH_TERM]"
        },
        RESULT: {
          PATH: "items",
          STRUCTURE: { id: "id", title: "name" }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://api.github.com/repositories/[ID]"
        },
        RESULT: {
          STRUCTURE: { id: "id", title: "name" }
        }
      }
    }
  },
  GITLAB: {
    PERSON: {
      LOGO_URL:
        "https://about.gitlab.com/images/press/logo/png/gitlab-logo-gray-rgb.png",
      FALLBACK_AVATAR: "UserOutlined",
      SEARCH_BY_TERM: {
        QUERY: {
          URL:
            "https://gitlab.com/api/v4/search?private_token=[TOKEN]&scope=users&search=[SEARCH_TERM]"
        },
        RESULT: {
          STRUCTURE: { id: "id", title: "name", avatar: "avatar_url" }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://gitlab.com/api/v4/users/[ID]"
        },
        RESULT: {
          STRUCTURE: { id: "id", title: "name", avatar: "avatar_url" }
        }
      }
    },
    PROJECT: {
      LOGO_URL:
        "https://about.gitlab.com/images/press/logo/png/gitlab-logo-gray-rgb.png",
      SEARCH_BY_TERM: {
        QUERY: {
          URL:
            "https://gitlab.com/api/v4/search?private_token=[TOKEN]&scope=projects&search=[SEARCH_TERM]"
        },
        RESULT: {
          STRUCTURE: { id: "id", title: "name" }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://gitlab.com/api/v4/projects/[ID]"
        },
        RESULT: {
          STRUCTURE: { id: "id", title: "name" }
        }
      }
    }
  },
  TISS: {
    PERSON: {
      LOGO_URL:
        "https://www.tiss.tuwien.ac.at/static/2.5.2/global/images/tiss_logo.png",
      FALLBACK_AVATAR: "UserOutlined",
      SEARCH_BY_TERM: {
        QUERY: {
          URL: "https://tiss.tuwien.ac.at/api/person/v22/psuche?q=[SEARCH_TERM]"
        },
        RESULT: {
          PATH: "results",
          TRANSFORM_FUNCTION: result => ({
            id: result.tiss_id,
            title: `${result.first_name} ${result.last_name}`,
            avatar: result.picture_uri
              ? `https://tiss.tuwien.ac.at${result.picture_uri}`
              : undefined
          }),
          STRUCTURE: { id: "id", title: "title", avatar: "avatar" }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://tiss.tuwien.ac.at/api/person/v22/id/[ID]"
        },
        RESULT: {
          TRANSFORM_FUNCTION: result => ({
            id: result.tiss_id,
            title: `${result.first_name} ${result.last_name}`,
            avatar: `https://tiss.tuwien.ac.at/${result.picture_uri}`
          }),
          STRUCTURE: { id: "id", title: "title", avatar: "avatar" }
        }
      }
    },
    PROJECT: {
      LOGO_URL:
        "https://www.tiss.tuwien.ac.at/static/2.5.2/global/images/tiss_logo.png",
      SEARCH_BY_TERM: {
        QUERY: {
          URL:
            "https://tiss.tuwien.ac.at/api/pdb/rest/projectFullSearch/v1?searchText=[SEARCH_TERM]"
        },
        RESULT: {
          PATH: "project",
          STRUCTURE: { id: "titleEn", title: "titleEn" }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://tiss.tuwien.ac.at/api/pdb/rest/project/v2/[ID]"
        },
        RESULT: {
          PATH: "project",
          STRUCTURE: { id: "titleEn", title: "titleEn" }
        }
      }
    }
  },
  REPOSITUM: {
    PROJECT: {
      LOGO_URL:
        "http://repositum.tuwien.ac.at/domainimage/hostedbyrepositum_150",
      SEARCH_BY_TERM: {
        QUERY: {
          URL:
            "https://explore.openaire.eu/cache/get?url=https%3A%2F%2Fservices.openaire.eu%2Fsearch%2Fv2%2Fapi%2Fresources%3Fquery%3D%20(%20(oaftype%20exact%20result)%20and%20(resulttypeid%20exact%20publication)%20%20)%20%20and%20(%20%22${[SEARCH_TERM]}%22%20and%20resulthostingdatasourceid%20exact%20%22opendoar____%253A%253A84c2d4860a0fc27bcf854c444fb8b400%22%20)%26page%3D0%26size%3D10%26format%3Djson",
          ENCODING_LEVEL: 2
        },
        RESULT: {
          PATH: "results",
          STRUCTURE: {
            id: `result.metadata["oaf:entity"]["oaf:result"].originalId`,
            title: `result.metadata["oaf:entity"]["oaf:result"].title.content`
          }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL:
            "http://api.openaire.eu/search/publications?format=json&openairePublicationID=[ID]"
        },
        RESULT: {
          PATH: "response.results.result.0.metadata.oaf:entity.oaf:result",
          TRANSFORM_FUNCTION: result => {
            return result; // TODO
          },
          STRUCTURE: {
            id: `result.metadata["oaf:entity"]["oaf:result"].originalId`,
            title: `title.$`
          }
        }
      }
    }
  },
 /* INVENIO: {
    PROJECT: {
      LOGO_URL:
        "https://invenio-software.org/static/img/logo-invenio-white.svg",
      FALLBACK_AVATAR: "ReadOutlined",
      SEARCH_BY_TERM: {
        QUERY: {
          URL: "https://zenodo.org/api/records/?page=1&size=20&q=[SEARCH_TERM]"
        },
        RESULT: {
          PATH: "id",
          STRUCTURE: { id: "id", title: "title" }
        }
      },
      GET_BY_ID: {
        QUERY: { URL: "https://zenodo.org/api/records/[ID]" },
        RESULT: { STRUCTURE: { id: "id", title: "title" } }
      }
    }
  }*/
};

module.exports = { externalApiConfig };
