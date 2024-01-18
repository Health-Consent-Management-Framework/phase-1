const UtilsLibrary = artifacts.require("Utils");
const Facility = artifacts.require("Facility")

module.exports = function(deployer) {
    deployer.deploy(UtilsLibrary);
    deployer.link(UtilsLibrary, Facility);
    deployer.deploy(Facility);
};