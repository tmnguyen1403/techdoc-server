const router = require("express").Router();
const patient = require("./patient");
const medical_provider = require("./medical_provider");

router.use("", [patient, medical_provider]);

module.exports = router;