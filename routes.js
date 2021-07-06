const express = require('express');
const router = express.Router()
const dbconnection = require('./dbconnection.js');
const cors = require('cors');

const bodyParser = require("body-parser");

router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(cors());


router.get("/people-list", async (req, res) => {
    res.json(await dbconnection.getPeopleList());
});

router.get("/", (req, res) => {
    res.json({hello: "world"});
});

router.get("/job-roles", async (req, res) => {
    console.log(req.query.name)
    res.json(await dbconnection.getJobRolesSpecifications(req.query.name));
});

module.exports = router;