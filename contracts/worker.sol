// SPDX-License-Identifier: MIT 
import "./admin.sol";


pragma solidity ^0.8.21;

contract Worker{

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

    struct UserType{
        string fname;
        string lname;
        string email;
        bytes32 password;
        address walletAddress; 
        Date DoB;
    }

    mapping(uint=>address) internal workersKeys;
    mapping(address=>UserType) workerData;
    mapping(address=>UserType) workerRequests;
    address[] internal workerRequestKeys;
    Admin adminContract;

    enum verficationStatus{verified,notVerfied,rejected}

    modifier isAdmin() {
        require(adminContract.checkIfAdmin(msg.sender), "Only admin can access the feature");
        _;
    }

    modifier isOwner(){
        require(msg.sender==workerRequests[msg.sender].walletAddress,"user doesn't own the resource to access.");
        _;
    }

    modifier isAdminOrOwner(){
        bool isSatisfied = false;
        isSatisfied = adminContract.checkIfAdmin(msg.sender);
        if(!isSatisfied) isSatisfied = checkIfWorker(msg.sender);
        require(isSatisfied,"user doesn't own the resource to access.");
        _;
    }

    uint totalWorkers;
    string workerSecret = 'worker_123';

    constructor(address admin){
        adminContract = Admin(admin);
        totalWorkers = 0;
    }

    function checkIfWorker(address senderAddress) public view returns(bool){
        return workerData[senderAddress].walletAddress == senderAddress;
    }

    function createWorkerRequest(
        string memory fname,
        string memory lname,
        string memory username,
        string memory password,
        address workerAddress,
        uint day, uint month, uint year
        ) public returns (bool){
        for(uint i=0;i<workerRequestKeys.length;i++){
            if(workersKeys[i]==workerAddress || workerRequestKeys[i]==workerAddress) return true;
        }
        Date memory date = Date(day,month,year); 
        bytes32 hashedPassword = hashPasswordWithSecret(password, workerSecret);
        UserType memory user = UserType(fname,lname,username,hashedPassword,workerAddress,date); 
        workerRequestKeys.push(workerAddress);
        workerRequests[workerAddress] = user;
        return true;
    }

    function removeWorker(address senderAddress)  public returns (bool){
        uint index = 0;
        bool exists = false;
        for(uint i=0;i<totalWorkers;i++){
            if(workersKeys[i]==senderAddress){
                exists = true;
                index = i;
            }
        }
        if(exists){
            delete workersKeys[index];
            delete workerData[workersKeys[index]];
            return true;
        }
        return false;
    }

    function approveWorkerRequest(address workerAddress) isAdmin public returns (bool){
        bool exists = false;
        uint index;
        for(uint i=0;i<workerRequestKeys.length;i++){
            if(workerRequestKeys[i]==workerAddress){
                exists = true;
                index = i;
                break;
            }
        }
        if(exists){
            workerData[workerAddress] = workerRequests[workerAddress];
            delete workerRequestKeys[index];
            delete workerRequests[workerAddress];
            return true;        
        }else return false;
    }

    function rejectWorkerRequest(address workerRequestAddress) isAdmin public returns (bool) {
        bool exists = false;
        uint index;
        for(uint i=0;i<workerRequestKeys.length;i++){
            if(workerRequestKeys[i]==workerRequestAddress){
                exists = true;
                index = i;
                break;
            }
        }
        if(exists){
            workerRequestKeys[index];
            delete workerRequests[workerRequestAddress];
            return true;        
        }
        return true;
    }

    function deleteWorkerRequest() public isOwner returns (bool){
        bool exists = false;
        uint index;
        for(uint i=0;i<workerRequestKeys.length;i++){
            if(workerRequestKeys[i]==msg.sender){
                exists = true;
                index = i;
                break;
            }
        }
        if(exists){
            delete workerRequestKeys[index];
            delete workerRequests[msg.sender];
            return true;        
        }
        return true;
    }

    function login(string memory email,string memory password,address walletAddress) public view returns (bool,string memory){
        bool exists = false;
        for(uint i=0;i<totalWorkers;i++){
            if(workersKeys[i]==walletAddress){ 
                exists = true;
                break;
            }
        }
        bytes32 hashedPassword = hashPasswordWithSecret(password, workerSecret);
        if(exists){    
            if(!compareString(workerData[walletAddress].email,email) || workerData[walletAddress].password != hashedPassword)
                return (true,'please check yyour credentials');
            return (true,"verfied");
        }else{
            for(uint i=0;i<workerRequestKeys.length;i++){
                if(workerRequestKeys[i]==walletAddress){
                    exists = true;
                    break;
                }
            }
            if(exists) return (true,"not verifed");
            else return (false,"check credentials");
        }
    }

    function compareString(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function hashPasswordWithSecret(string memory password, string memory secret) public pure returns (bytes32) {
        bytes memory passwordBytes = bytes(password);
        bytes memory secretBytes = bytes(secret);
        return keccak256(abi.encodePacked(passwordBytes, secretBytes));
    }
}