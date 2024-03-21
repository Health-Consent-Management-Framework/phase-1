// SPDX-License-Identifier: MIT 
import "./admin.sol";


pragma solidity ^0.8.21;

contract Worker{

    event WorkerFound(address);
    event WorkerCreated(address);
    event RequestCreated();
    event RequestAlreadyCreated();
    event RequestApproved();
    event RequestRejected();

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

    struct workerType{
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

    struct workerRequestType{
        address walletAddress;
        string email;
        verficationStatus isVerfied;
        string requestType;
        uint created_at;
    }

    mapping(address=>workerType) workerData;
    mapping(address=>workerRequestType) workerRequests;
    address[] internal workerRequestKeys;
    address[] internal workersKeys;
    uint totalWorkers =0;
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

    string workerSecret = 'worker_123';

    constructor(address admin){
        adminContract = Admin(admin);
        totalWorkers = 0;
    }

    function checkIfWorker(address senderAddress) public view returns(bool){
        return workerData[senderAddress].walletAddress == senderAddress;
    }

    function createRequest(
        string memory email,
        string memory requestType,
        uint date
        ) public returns (bool){
        for(uint i=0;i<workerRequestKeys.length;i++){
            if(workerRequestKeys[i]==msg.sender){
                emit RequestAlreadyCreated();
                return false;
            }
        }
        workerRequestType memory user = workerRequestType(msg.sender,email,verficationStatus.notVerfied,requestType,date); 
        workerRequestKeys.push(msg.sender);
        workerRequests[msg.sender] = user;
        return true;
    }

    function createWorker(
        string memory fname,
        string memory lname,
        string memory email,
        string memory mobileNo,
        string memory gender,
        uint height,
        uint weight,
        uint date,
        address workerAddress
        ) public returns (bool){
        //
        if(workerData[workerAddress].walletAddress!=address(0)){
            emit WorkerFound(workerAddress);
            return false;
        }
        workerType memory user = workerType(fname,lname,email,mobileNo,gender,false,height,weight,workerAddress,date); 
        workersKeys.push(workerAddress);
        workerData[workerAddress] = user;
        emit WorkerCreated(workerAddress);
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
            workerData[workerAddress].isVerified = true;
            workerRequests[workerAddress];
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
            delete workerRequestKeys[index];
            workerRequests[workerRequestAddress].isVerfied = verficationStatus.notVerfied;
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


    function compareString(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }


    function getWorker(address workerAddress) public view returns(workerType memory){
        return workerData[workerAddress];
    }
}