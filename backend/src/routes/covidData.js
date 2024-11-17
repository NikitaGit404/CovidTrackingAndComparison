// src/routes/covidData.js
const express = require("express");
const router = express.Router();
const covidDataController = require("../controllers/covidDataController");
const userSearchController = require("../controllers/userSearchController");

router.get("/countries", covidDataController.getCountries);
router.get("/country-cases", covidDataController.getCasesByCountry);
router.get("/total-cases", covidDataController.getMaxCasesByCountry);
router.get("/vaccination-per", covidDataController.getVaccinationPercentage);

router.get("/get-user-searches", userSearchController.getUserSearchesByEmail);
router.post("/create-user-search", userSearchController.createUserSearch);
// Export the router
module.exports = router;
