const Hello = artifacts.require("Hello");
const name = artifacts.require("Name")

module.exports =async function(_deployer) {
  const helloContract = await _deployer.deploy(Hello);
  const nameContract = await _deployer.deploy(name)
};
