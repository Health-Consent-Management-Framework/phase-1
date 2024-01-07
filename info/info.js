const Hello = artifacts.require("Hello");
const name = artifacts.require("Name")

module.exports =async function(_deployer) {
  const helloContract = await Hello.deployed()
  const nameContract = await name.deployed()
  console.log(helloContract.address,helloContract.abi)
  console.log(nameContract.address,nameContract.abi)
};
