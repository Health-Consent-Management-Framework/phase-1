// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import './worker.sol';

contract Patient {

    Worker workerContract;
    uint totalPatients;
    enum status{pending,accepted,rejeceted}

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

    struct PatientType {
        string fname;
        string lname;
        string email;
        string password;
        string location;
        Date DoB;
        address walletAddress;
    }

    struct PatientDeleteRequest{
        uint requestedTimestamp;
        uint modifiedTimestamp;
        status requestStatus;
        address patientAddress;
        string reason;
    }

    constructor(address workerAddress){
        workerContract = Worker(workerAddress);
    }

    modifier isWorker(){
        require(workerContract.checkIfWorker(msg.sender),"only worker can access the feature");
        _;
    }

    modifier isOwner(){
        require(msg.sender==patients[msg.sender].walletAddress,"user doesn't own the resource to access.");
        _;
    }
    

    mapping(uint => address) public patientKeys;
    mapping(address => PatientType) public patients;
    mapping(address=>PatientDeleteRequest) public patientDeleteRequests;


    event PatientCreated(uint256 totalPatients, string email);
    event PatientDeleted(address patientAddress);
    event PatientAccepted(address patientAddress, string name,uint age);
    event PatientUpdated(address patietnAddress);

    function compareString(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function createPatient(
        string memory fname,string memory lname,
        string memory email,string memory password,
        uint day,uint month, uint year,
        string memory location,
        address patientAddress
        ) external {
        if(compareString(email, patients[patientAddress].email)){
            revert("patient with given email already exists");
        }
        Date memory date = Date(day,month,year);
        // Location memory location = Location(street,district,state);
        patientKeys[totalPatients] = patientAddress;
        totalPatients+=1;
        patients[patientAddress] = PatientType(fname,lname,email,password,location,date,patientAddress);
        emit PatientCreated(totalPatients, email);
    }

    function updatePatient(address _patientId) public isOwner returns(bool){
        emit PatientUpdated(_patientId);
        return true;
    }

    function deletePatient(address _patientId) external isWorker {
        delete patients[_patientId];
        emit PatientDeleted(_patientId);
    }

    function getPatient(address patientAddress) external view returns (PatientType memory) {
        return patients[patientAddress];
    }

    function getAllPatient() public view returns(PatientType[] memory) {
        PatientType[] memory allPatients = new PatientType[](totalPatients);
        for(uint i=0;i<totalPatients;i++){
            allPatients[i] = patients[patientKeys[i]];
        }
        return allPatients;
    }
}
