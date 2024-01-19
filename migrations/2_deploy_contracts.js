const UtilsLibrary = artifacts.require("Utils");
const Facility = artifacts.require("Facility")
const Patient = artifacts.require("PatientRecordSystem")
const NameStorage = artifacts.require("NameStorage")

module.exports = async function(deployer,network,accounts) {
    const deployerAddress = accounts[0]; 
    deployer.deploy(UtilsLibrary,{ from: deployerAddress });
    deployer.link(UtilsLibrary, Facility);
    deployer.deploy(Facility,{from:deployerAddress})
    deployer.deploy(Patient,{ from: deployerAddress });
    deployer.deploy(NameStorage,{ from: deployerAddress });

};