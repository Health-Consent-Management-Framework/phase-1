const UtilsLibrary = artifacts.require("Utils");
const Facility = artifacts.require("Facility")
const Patient = artifacts.require("PatientRecordSystem")
const NameStorage = artifacts.require("NameStorage")
const Admin = artifacts.require("Admin")
const Doctor = artifacts.require("Doctor")
const DoctorsRecord = artifacts.require("DoctorsRecord")

module.exports = async function(deployer,network,accounts) {
    const deployerAddress = accounts[0]; 
    deployer.deploy(UtilsLibrary,{ from: deployerAddress });
    deployer.link(UtilsLibrary, Facility);
    deployer.deploy(Facility,{from:deployerAddress})
    deployer.deploy(Patient,{ from: deployerAddress });
    deployer.deploy(NameStorage,{ from: deployerAddress }); 
    deployer.deploy(Admin,{from:deployerAddress});
    deployer.deploy(Doctor,{from:deployerAddress});
    deployer.deploy(DoctorsRecord,{from:deployerAddress});
};