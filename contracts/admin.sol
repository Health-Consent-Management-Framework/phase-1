// SPDX-License-Identifier: GPL-3.0
/**
   * @title Admin
   * @dev Contract to create a admin user
   * @custom:dev-run-script scripts/deploy_with_ethers.ts
   */
pragma solidity ^0.8.21;


contract Admin{

    modifier isAdmin(){
        require(msg.sender == masterAdmin || bytes(adminAddresses[msg.sender].email).length>0,"only master admin can add the user");
    _;    
    }

    address userContractAddress;

    address[] public adminKeys;
    mapping(address => AdminType) public adminAddresses;
    address[] public adminRequestkeys;
    mapping(address => AdminRequest) public adminRequests;
    uint totalAdminCount = 0;
    uint totalRequestCount = 0;

    event logAdmin(uint number,string data);
    event logAddress(uint number,address data);

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
        string password;
        address walletAddress; 
        Date DoB;
        bool verified;
    }

    struct AdminRequest{
        address walletAddress;
        RequestStatusType requestStatus; 
    }

    constructor(){
        masterAdmin = msg.sender;
        totalAdminCount = 1;
    }

    function createAdminRequest(
        string memory fname,
        string memory lname,
        string memory email,
        string memory password,
        address fromAddress,
        uint day, uint month, uint year
    ) public returns (bool) {
        if(adminAddresses[fromAddress].walletAddress==address(0)){
            Date memory date = Date(day, month, year);
            AdminType memory newAdmin = adminAddresses[fromAddress];
            newAdmin.fname = fname;
            newAdmin.lname = lname;
            newAdmin.email = email;
            newAdmin.password = password;
            newAdmin.DoB = date;
            newAdmin.verified = false;
            adminAddresses[fromAddress] = newAdmin;
            // AdminType memory newAdmin = AdminType(fname, lname, email, password, fromAddress, date, false);
            adminRequestkeys.push(fromAddress);
            totalRequestCount += 1;
            // adminAddresses[fromAddress] = newAdmin;
        }
        AdminRequest memory newRequest = AdminRequest(fromAddress, RequestStatusType.pending);
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
        if(adminAddresses[_adminAddress].verified) return true;
        return false;
    }

    function login(string memory email,string memory password,address walletAddress) public view returns (bool,string memory){
        if(checkIfAdmin(walletAddress)){
            if(
                   !compareString(adminAddresses[walletAddress].email,email)
                || !compareString(adminAddresses[walletAddress].password,password)) 
                    return (false,"invalid credentials");
            return (true,"admin logged in successfully");
        }else revert('user is not an admin');
    }

    function hashPasswordWithSecret(string memory password, string memory secret) public pure returns (bytes32) {
        bytes memory passwordBytes = bytes(password);
        bytes memory secretBytes = bytes(secret);
        return keccak256(abi.encodePacked(passwordBytes, secretBytes));
    }

    function acceptAdminRequest(address newAdmin) public returns (address newAdminAddress){
        require(msg.sender==masterAdmin || bytes(adminAddresses[msg.sender].email).length>0,"only master admin can add the user");
        if(bytes(adminAddresses[msg.sender].email).length==0){
            revert("user doesn't exist");
        }
        adminAddresses[newAdmin].verified = true;
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
        AdminRequest[] memory requests = new AdminRequest[](totalRequestCount);
        for(uint i=0;i<totalRequestCount;i++){
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

}
