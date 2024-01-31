const UtilsLibrary = artifacts.require("Utils");
const Facility = artifacts.require("Facility")
const Patient = artifacts.require("Patient")
const Admin = artifacts.require("Admin")
const User = artifacts.require("User")
const Doctor = artifacts.require("Doctor")
const Report = artifacts.require("Report")
const Worker = artifacts.require("Worker")
const fs = require('fs')

module.exports = async function(deployer,network,accounts) {
  const deployerAddress = accounts[0]; 
  await deployer.deploy(UtilsLibrary,{ from: deployerAddress });
  await deployer.deploy(Admin,{from:deployerAddress});
  await deployer.deploy(Worker,{from:deployerAddress});
  await deployer.deploy(Patient,Worker.address,{from:deployerAddress});
  await deployer.deploy(Doctor,{from:deployerAddress});
  await deployer.link(UtilsLibrary, Facility);
  
  const adminContract = await Admin.deployed();
  const workerContract = await Worker.deployed();
  const doctorContract = await Doctor.deployed();
  const patientContract = await Patient.deployed();
  
  console.log(Patient)

  await deployer.deploy(User,Patient.address,Doctor.address,Worker.address,Admin.address)
  await deployer.deploy(Report,Patient.address,Doctor.address,Worker.address,User.address)
  await deployer.deploy(Facility,Admin.address,{from:deployerAddress})
  console.log('contracts-1 deployed')
};
