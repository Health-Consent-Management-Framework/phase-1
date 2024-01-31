const User = artifacts.require("User")
const {Web3} = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))

module.exports = async function(deployer,network,accounts) {
  const deployerAddress = accounts[0]; 
  const userContract = await User.deployed()
  // const transaction = await web3.eth.sendTransaction({from:deployerAddress,to:userContract.address,value:web3.utils.toWei(1, "ether")})
  // console.log(transaction)
}