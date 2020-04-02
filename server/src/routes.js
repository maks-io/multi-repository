const express = require("express");
const dspaceController = require("./controllers/repositum-controller");
const invenioController = require("./controllers/invenio-controller");
const gitlabProjectsController = require("./controllers/gitlab-projects-controller");
const gitlabPersonsController = require("./controllers/gitlab-persons-controller");
const githubProjectsController = require("./controllers/github-projects-controller");
const githubPersonsController = require("./controllers/github-persons-controller");
const tissPersonsController = require("./controllers/tiss-persons-controller");
const tissProjectsController = require("./controllers/tiss-projects-controller");
const linksController = require("./controllers/links-controller");

const router = express.Router();

/***** Repositum *****/
router.get(
  "/api/repositum/project/search/:searchterm",
  dspaceController.searchProjects
);

/***** Invenio / Zenodo *****/
router.get(
  "/api/invenio/project/search/:searchterm",
  invenioController.searchProjects
);

/***** Gitlab Projects *****/
router.get(
  "/api/gitlab/project/search/:searchterm",
  gitlabProjectsController.searchProjects
);

/***** Gitlab Persons *****/
router.get(
  "/api/gitlab/person/search/:searchterm",
  gitlabPersonsController.searchGitlabPersons
);

/***** Github Projects *****/
router.get(
  "/api/github/project/search/:searchterm",
  githubProjectsController.searchProjects
);

/***** Github Persons *****/
router.get(
  "/api/github/person/search/:searchterm",
  githubPersonsController.searchGithubPersons
);

/***** tiss Persons *****/
router.get(
  "/api/tiss/person/search/:searchterm",
  tissPersonsController.searchTissPersons
);

/***** tiss Projects *****/
router.get(
  "/api/tiss/project/search/:searchterm",
  tissProjectsController.searchTissProjects
);

/***** Links *****/
router.post("/api/links", linksController.fetchLinks);

module.exports = router;
