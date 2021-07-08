const express = require('express');
const router = express.Router()
const cors = require('cors');
const dbconnection = require('./dbconnection.js');

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

router.get("/getJobRoles", async (req, res) => {
  res.json(await dbconnection.getJobRoles());
})

router.get("/rolesWithCapabilityNames", async (req, res) => {
    let role_id = req.params.id;
    let response = await dbconnection.getCapabilitiesOfRoles();
    res.json(response);
});

router.get("/job-roles", async (req, res) => {
    console.log(req.query.name)
    res.json(await dbconnection.getJobRolesSpecifications(req.query.name));
});

router.get("/getBandCompetencies", async (req, res) => {
    res.json(await dbconnection.getBandCompetencies());
})
module.exports = router;
