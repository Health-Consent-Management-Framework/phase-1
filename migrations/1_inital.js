const UtilsLibrary = artifacts.require("Utils");
const Facility = artifacts.require("Facility")
const Patient = artifacts.require("Patient")
const Admin = artifacts.require("Admin")
const User = artifacts.require("User")
const Doctor = artifacts.require("Doctor")
const Report = artifacts.require("Report")
const Worker = artifacts.require("Worker")
const Request = artifacts.require("Request")

module.exports = async function(deployer,network,accounts) {
  const deployerAddress = accounts[0]; 
  await deployer.deploy(UtilsLibrary,{ from: deployerAddress });
  await deployer.deploy(User,{from:deployerAddress});
  await deployer.deploy(Request,User.address,{from:deployerAddress});
  await deployer.deploy(Admin,User.address,Request.address,{from:deployerAddress});
  await deployer.deploy(Doctor,{from:deployerAddress});
  await deployer.link(UtilsLibrary, Facility);

  await deployer.deploy(Worker,Admin.address,Request.address,{from:deployerAddress});
  await deployer.deploy(Facility,Admin.address,{from:deployerAddress});
  await deployer.deploy(Patient,User.address,{from:deployerAddress});
  await deployer.deploy(Report,Patient.address,Doctor.address,Worker.address,User.address,{from:deployerAddress})
};
