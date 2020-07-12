const express = require("express");
const linksController = require("./controllers/links-controller");
const externalResourceController = require("./controllers/external-resource-controller");

const router = express.Router();

/***** External Resources *****/
router.get("/api/external-resources", externalResourceController._getExternalResources);
router.get(
  "/api/search-by-term/:platform/:type/:searchTerm",
  externalResourceController.searchByTerm
);

/***** Links *****/
router.post("/api/links", linksController.fetchLinks); // this gets all links according to step 0 search results
router.post("/api/link", linksController.postLink); // this posts a new link
router.delete("/api/link", linksController.deleteLink); // this posts a new link

module.exports = router;
