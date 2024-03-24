// SPDX-License-Identifier: GPL-3.0
/**
   * @title Admin
   * @dev Contract to create a admin user
   * @custom:dev-run-script scripts/deploy_with_ethers.ts
   */
pragma solidity ^0.8.21;

import './user.sol';
import './requests.sol';

contract Admin{

    modifier isAdmin(){
        require(msg.sender == masterAdmin || bytes(adminAddresses[msg.sender].email).length>0,"only master admin can add the user");
    _;    
    }

    User userContract;
    Request requestContract;
    address[] public adminKeys;
    mapping(address => AdminType) public adminAddresses;
    address[] public adminRequestkeys;
    mapping(address => AdminRequest) public adminRequests;
    uint totalAdminCount = 0;

    event AdminFound(address);
    event AdminCreated(address);
    event delegateCallFailed();
    enum RequestStatusType {pending,approved,rejected}
    address public masterAdmin;

    struct Date{
        uint date;
        uint month;
        uint year;
    }

    struct Location{
        string street;
        string district;
        string state;
    }

    struct AdminType{
        string fname;
        string lname;
        string email;
        string mobileNo;
        string gender;
        bool isVerified;        
        uint height;
        uint weight;
        address walletAddress; 
        uint DoB;
    }

    struct AdminRequest{
        address walletAddress;
        string email;
        uint created_at;
        RequestStatusType requestStatus; 
    }

    constructor(address userContractAddress){
        masterAdmin = msg.sender;
        userContract = User(userContractAddress);
        // requestContract = Request(requestContractAddress);
        totalAdminCount = 1;
    }

    function createAdminRequest(
        string memory email,
        address fromAddress,
        uint date
    ) public returns (bool) {
        if(adminAddresses[fromAddress].walletAddress==address(0)){
            adminRequestkeys.push(fromAddress);
        }else{
            emit AdminFound(fromAddress);
            return false;
        }

        AdminRequest memory newRequest = AdminRequest(fromAddress,email,date,RequestStatusType.pending);
        adminRequests[fromAddress] = newRequest;
        return true;
    }


    function getTotalAdminCount() public view returns (uint256){
        return totalAdminCount;
    }

    function getAdmins() public view returns (address[] memory) {
        address[] memory admins = new address[](totalAdminCount);
        uint256 index = 0;
        for (uint i=0;i<totalAdminCount;i++) {
            admins[i] = adminKeys[i];
            index++;
        }
        return admins;
    }

    function checkIfAdmin(address _adminAddress) public view returns(bool){
        if(adminAddresses[_adminAddress].isVerified) return true;
        return false;
    }


    function acceptAdminRequest(address newAdmin) public returns (address newAdminAddress){
        require(msg.sender==masterAdmin || bytes(adminAddresses[msg.sender].email).length>0,"only master admin can add the user");
        if(bytes(adminAddresses[msg.sender].email).length==0){
            revert("user doesn't exist");
        }
        adminAddresses[newAdmin].isVerified = true;
        adminRequests[newAdmin].requestStatus = RequestStatusType.approved;
        adminKeys.push(newAdmin);
        totalAdminCount+=1;
        return newAdmin;
    }

    function declineAdminRequest(address newAdmin) public returns (address rejectedAddress){
        require(msg.sender==masterAdmin || bytes(adminAddresses[msg.sender].email).length>0,"only master admin can add the user");
        if(bytes(adminAddresses[msg.sender].email).length==0){
            revert("user doesn't exist");
        }
        adminRequests[newAdmin].requestStatus = RequestStatusType.rejected;
        return newAdmin;
    }

    function getAdminRequests()public view returns (AdminRequest[] memory){
        AdminRequest[] memory requests = new AdminRequest[](adminRequestkeys.length);
        for(uint i=0;i<adminRequestkeys.length;i++){
            requests[i] = adminRequests[adminRequestkeys[i]];
        }
        return requests;
    }

    function getMasterAdmin() public view returns (address){
        return  masterAdmin;
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);       
    }

    function compareString(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function getAdmin(address id) public view returns (AdminType memory){
        return adminAddresses[id];
    }

    function createAdmin(
        string memory fname,
        string memory lname,
        string memory email,
        string memory mobileNo,
        string memory gender,
        uint height,
        uint weight,
        uint dob,
        address walletAddress
    ) public returns (bool){
        if(adminAddresses[walletAddress].walletAddress!=address(0)){
            emit AdminFound(walletAddress);
            return false;
        }
        bool isVerified = userContract.getVerificationStatus(msg.sender, 1);
        AdminType memory admin = AdminType(fname,lname,email,mobileNo,gender,isVerified,height,weight,walletAddress,dob);
        adminAddresses[walletAddress] = admin;
        emit AdminCreated(walletAddress);
        return true;
    }

    function verifyUser(address walletAddress,bool updatedStatus) public returns (bool){
        if(updatedStatus) adminAddresses[walletAddress].isVerified = true;
        return true;
    }

}
