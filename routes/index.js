const router = require("express").Router();
const patient = require("./patient");

router.use("", [patient]);

module.exports = router;