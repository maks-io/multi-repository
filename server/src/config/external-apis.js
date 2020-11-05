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
          TRANSFORM_FUNCTION: result => ({
            id: result.id,
            title: result.login,
            avatar: result.avatar_url,
            originalSourceUrl: result.html_url
          }),
          STRUCTURE: {
            id: "id",
            title: "title",
            avatar: "avatar",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://api.github.com/users/[ID]"
        },
        RESULT: {
          PATH: "items",
          TRANSFORM_FUNCTION: result => ({
            id: result.id,
            title: result.login,
            avatar: result.avatar_url,
            originalSourceUrl: result.html_url
          }),
          STRUCTURE: {
            id: "id",
            title: "title",
            avatar: "avatar",
            originalSourceUrl: "originalSourceUrl"
          }
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
          TRANSFORM_FUNCTION: result => ({
            id: result.id,
            title: result.name,
            originalSourceUrl: result.html_url
          }),
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://api.github.com/repositories/[ID]"
        },
        RESULT: {
          TRANSFORM_FUNCTION: result => ({
            id: result.id,
            title: result.name,
            originalSourceUrl: result.html_url
          }),
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
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
          TRANSFORM_FUNCTION: result => ({
            id: result.id,
            title: result.name,
            avatar: result.avatar_url,
            originalSourceUrl: result.web_url
          }),
          STRUCTURE: {
            id: "id",
            title: "name",
            avatar: "avatar",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://gitlab.com/api/v4/users/[ID]"
        },
        RESULT: {
          TRANSFORM_FUNCTION: result => ({
            id: result.id,
            title: result.name,
            avatar: result.avatar_url,
            originalSourceUrl: result.web_url
          }),
          STRUCTURE: {
            id: "id",
            title: "name",
            avatar: "avatar",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      }
    },
    /*PROJECT: {
      LOGO_URL:
        "https://about.gitlab.com/images/press/logo/png/gitlab-logo-gray-rgb.png",
      SEARCH_BY_TERM: {
        QUERY: {
          URL:
            "https://gitlab.com/api/v4/search?private_token=[TOKEN]&scope=projects&search=[SEARCH_TERM]"
        },
        RESULT: {
          TRANSFORM_FUNCTION: result => ({
            id: result.id,
            title: result.name,
            originalSourceUrl: result.web_url
          }),
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://gitlab.com/api/v4/projects/[ID]"
        },
        RESULT: {
          TRANSFORM_FUNCTION: result => ({
            id: result.id,
            title: result.name,
            originalSourceUrl: result.web_url
          }),
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      }
    }*/
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
              : undefined,
            originalSourceUrl: `https://tiss.tuwien.ac.at/${result.card_uri}`
          }),
          STRUCTURE: {
            id: "id",
            title: "title",
            avatar: "avatar",
            originalSourceUrl: "originalSourceUrl"
          }
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
            avatar: result.picture_uri
              ? `https://tiss.tuwien.ac.at${result.picture_uri}`
              : undefined,
            originalSourceUrl: `https://tiss.tuwien.ac.at/${result.card_uri}`
          }),
          STRUCTURE: {
            id: "id",
            title: "title",
            avatar: "avatar",
            originalSourceUrl: "originalSourceUrl"
          }
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
          TRANSFORM_FUNCTION: result => {
            return {
              id: result.id,
              title: result.titleEn,
              originalSourceUrl: `https://tiss.tuwien.ac.at/fpl/project/index.xhtml?id=${result.id}`
            };
          },
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL: "https://tiss.tuwien.ac.at/api/pdb/rest/project/v2/[ID]"
        },
        RESULT: {
          PATH: "project",
          TRANSFORM_FUNCTION: result => {
            return {
              id: result.id,
              title: result.titleEn,
              originalSourceUrl: `https://tiss.tuwien.ac.at/fpl/project/index.xhtml?id=${result.id}`
            };
          },
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
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
          TRANSFORM_FUNCTION: result => {
            return {
              id: result.result.metadata["oaf:entity"]["oaf:result"].originalId,
              title:
                result.result.metadata["oaf:entity"]["oaf:result"].title
                  .content,
              originalSourceUrl: `https://explore.openaire.eu/search/publication?articleId=${result.result.header["dri:objIdentifier"]}`
            };
          },
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      },
      GET_BY_ID: {
        QUERY: {
          URL:
            "http://api.openaire.eu/search/publications?format=json&openairePublicationID=[ID]"
        },
        RESULT: {
          PATH: "response.results.result.0",
          TRANSFORM_FUNCTION: result => {
            return {
              id: result.metadata["oaf:entity"]["oaf:result"].originalId["$"],
              title: result.metadata["oaf:entity"]["oaf:result"].title["$"],
              originalSourceUrl: `https://explore.openaire.eu/search/publication?articleId=${result.header["dri:objIdentifier"]["$"]}`
            };
          },
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      }
    }
  },
  INVENIO: {
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
          TRANSFORM_FUNCTION: result => {
            return {
              id: result.id,
              title: result.title,
              originalSourceUrl: result.doi_url
            };
          },
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      },
      GET_BY_ID: {
        QUERY: { URL: "https://zenodo.org/api/records/[ID]" },
        RESULT: {
          TRANSFORM_FUNCTION: result => {
            return {
              id: result.id,
              title: result.title,
              originalSourceUrl: result.doi_url
            };
          },
          STRUCTURE: {
            id: "id",
            title: "title",
            originalSourceUrl: "originalSourceUrl"
          }
        }
      }
    }
  }
};

module.exports = { externalApiConfig };
