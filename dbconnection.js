const mysql = require('mysql')

const express = require("express");
const cors = require('cors');
const app = express()
const dbconfig = require('./dbconfig.js')

const util = require('util')

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

function wrapDB(dbconfig) {
    const pool = mysql.createPool(dbconfig)
    return {
        query(sql, args) {
            return util.promisify(pool.query)
                .call(pool, sql, args)
        },
        release() {
            return util.promisify(pool.releaseConnection)
                .call(pool)
        }
    }
}

const db = wrapDB(dbconfig);

exports.getJobRoles = async () => {
    let response = await db.query('SELECT RoleID, RoleName, RoleSpec, RoleSpecSummary, CapabilityName, BandName, BandLevel FROM JobRoleDatabase.Role JOIN JobFamily USING (JobFamilyID) JOIN Capability USING (CapabilityID) JOIN Band USING (BandID);')
    return response;
}

exports.getJobFamilies = async () => {
    let response = await db.query('SELECT * FROM JobFamily;')
    return response;
}


exports.getBandResponsibilities = async () => {
    let response = await db.query('SELECT BandID, BandName, BandLevel, Responsibilities FROM JobRoleDatabase.Band');
    return response;
  }



exports.getCapabilityAndJobFamily = async () => {
  let response = await db.query('SELECT CapabilityName, JobFamilyName FROM JobRoleDatabase.Capability JOIN JobFamily USING (CapabilityID);')
  return response;
}



exports.getTraingByBand = async() => {
    let response = await db.query('Select BandID, BandLevel, TrainingType,  BandName, TrainingName, TrainingLink FROM JobRoleDatabase.Band Join Band_Training USING (BandID) JOIN Training Using (TrainingID);')
    return response;
}

exports.getCapabilities= async () => {
    let response = await db.query('SELECT * FROM Capability;')
    return response
}
exports.getBands = async () => {
    let response = await db.query('SELECT * FROM Band;')
    return response;
}

exports.getJobRolesSpecifications = async (name) => {
    console.log(name);
    let results = await db.query(`SELECT RoleName, RoleSpec FROM JobRoleDatabase.Role where RoleName = '${name}' `)
}

exports.getBandCompetencies = async () => {
    let result = await db.query('SELECT BandName, BandLevel, CompetenciesName FROM Band JOIN Band_Competency USING(BandID) JOIN Competencies USING (CompetenciesID);');
    return result;
}

exports.addRole = async (Role) => {
    let results = await db.query('INSERT INTO Role SET ?', Role);
    return results.insertId;
}

exports.deleteRole = async (id) => {
    let results = await db.query('DELETE FROM Role WHERE RoleID = ?', id);
    return results;
}

exports.editRole = async (Role, id) => {
    let results = await db.query('UPDATE Role SET ? WHERE RoleID = ?', [Role, id]);
    return results;
}

exports.editBand = async (Band, id) => {
    let results = await db.query('UPDATE Band SET ? WHERE BandID = ?', [Band, id]);
    return results;
}

exports.getRoleWithCapabilityID = async (id) => {
    let response = await db.query('SELECT * FROM Role JOIN JobFamily USING(JobFamilyID) JOIN Capability USING(CapabilityID) WHERE RoleID = ?;', id)
    return response;
}

exports.getAssociatedTrainingIDsWithBand = async (id) => {
    let response = await db.query('SELECT TrainingID FROM Band JOIN Band_Training USING(BandID) WHERE BandID = ?;', id)
    return response;
}

exports.getAssociatedCompetenciesIDsWithBand = async (id) => {
    let response = await db.query('SELECT Band_Competency.CompetenciesID FROM Band JOIN Band_Competency USING(BandID) WHERE BandID = ?;', id)
    return response;
}

exports.getBand = async (id) => {
    let response = await db.query('SELECT * FROM Band WHERE BandID = ?;', id)
    return response;
}
  
exports.addJobFamily = async (newJobFamily) => {
  let results = await db.query('INSERT INTO JobFamily SET ?',  newJobFamily)
  return results;
}

exports.deleteJobFamily = async (id) => {
    let results = await db.query('DELETE FROM JobFamily WHERE JobFamilyID = ?', id);
    return results;
}

exports.deleteBand = async (id) => {
    let results = await db.query('DELETE FROM Band WHERE BandID = ?', id);
    return results;
}

exports.deleteAssociatedTrainingsWithBand = async (id) => {
    let results = await db.query('DELETE FROM Band_Training WHERE BandID = ?', id);
    return results;
}

exports.deleteAssociatedCompetenciesWithBand = async (id) => {
    let results = await db.query('DELETE FROM Band_Competency WHERE BandID = ?', id);
    return results;
}

exports.addBand = async (Band) => {
    let results = await db.query('INSERT INTO Band SET ?', Band);
    return results.insertId;
}

exports.addBandTraining = async (trainingID, bandID) => {
    let results = await db.query('INSERT INTO Band_Training VALUES (?, ?)', [trainingID, bandID]);
    return results.insertId;
}


exports.addBandCompetency = async (competenciesID, bandID) => {
    let results = await db.query('INSERT INTO Band_Competency VALUES (?, ?)', [competenciesID, bandID]);
    return results.insertId;
}

exports.getCompetencies = async () => {
    let response = await db.query('SELECT * FROM Competencies;')
    return response;
}

exports.getCapabilityLeads = async () => {
    let response = await db.query('SELECT * FROM JobRoleDatabase.CapabilityLeads JOIN Capability USING (CapabilityLeadID);')
    return response;
}
exports.getTrainings = async () => {
    let response = await db.query('SELECT * FROM Training;')
    return response;
}

exports.addCapability = async (Capability) => {
    let results = await db.query('INSERT INTO Capability SET ?', Capability);
    return results.insertId;
}

exports.deleteCapability = async (id) => {
    let results = await db.query('DELETE FROM Capability WHERE CapabilityID = ?', id);
    return results;
}
