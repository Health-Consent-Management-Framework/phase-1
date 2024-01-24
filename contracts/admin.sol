// SPDX-License-Identifier: GPL-3.0
/**
   * @title Admin
   * @dev Contract to create a admin user
   * @custom:dev-run-script scripts/deploy_with_ethers.ts
   */
pragma solidity ^0.8.21;

import {Ownable} from "./owner.sol";

contract Admin{
    mapping(uint => address) private adminKeys;
    mapping(address=>bool) public adminAddresses;
    uint totalAdmins = 0;

    constructor(){
        adminKeys[totalAdmins] = msg.sender;
        adminAddresses[adminKeys[totalAdmins]] = true;
        totalAdmins = 1;
    }

    function createAdmin(address newAdmin) public {
        require(adminAddresses[msg.sender], "Only admin can add a new admin");
        adminKeys[totalAdmins] =  newAdmin;
        totalAdmins+=1;
        adminAddresses[adminKeys[totalAdmins]] = true;
    }

    function totalAdminCount() public view returns (uint256){
        return totalAdmins;
    }


    function getAdmins() public view returns (address[] memory) {
        address[] memory admins = new address[](totalAdmins);
        uint256 index = 0;
        for (uint i=0;i<totalAdmins;i++) {
            admins[i] = adminKeys[i];
            index++;
        }
        return admins;
    }
}