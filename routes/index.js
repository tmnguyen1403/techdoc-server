const router = require("express").Router();
const patient = require("./patient");
const doctor = require("./doctor");

router.use("", [patient, doctor]);

module.exports = router;