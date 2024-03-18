// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import './worker.sol';
import './admin.sol';

contract Patient {

    Worker workerContract;
    Admin  adminContract;
    uint totalPatients = 0;

    enum status{pending,accepted,rejeceted}
    string patientSecret = 'patient_123';
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
        bytes32 password;
        string location;
        Date DoB;
        address walletAddress;
        bool verfiedEmailAddress;
    }

    struct PatientDeleteRequest{
        uint requestedTimestamp;
        uint modifiedTimestamp;
        status requestStatus;
        address patientAddress;
        string reason;
    }

    constructor(address workerAddress,address adminAddress){
        workerContract = Worker(workerAddress);
        adminContract = Admin(adminAddress);
    }

    modifier isWorker(){
        require(workerContract.checkIfWorker(msg.sender),"only worker can access the feature");
        _;
    }

    modifier isOwner(){
        require(msg.sender==patients[msg.sender].walletAddress,"user doesn't own the resource to access.");
        _;
    }
    

    address[] public patientKeys;
    mapping(address => PatientType) public patients;
    mapping(address=> PatientDeleteRequest) public patientDeleteRequests;


    event PatientCreated(uint256 totalPatients, string email);
    event PatientFound(address patientAddress);
    event PatientNotFound(address patientAddress);
    event PatientDeleted(address patientAddress);
    event PatientAccepted(address patientAddress, string name,uint age);
    event PatientUpdated(address patietnAddress);
    event PatientVerified(address patientAddress,bool status);

    function compareString(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function createPatient(
        string memory fname,string memory lname,
        string memory email,string memory password,
        uint day,uint month, uint year,
        string memory location,
        address patientAddress
        ) public returns (bool) {
        if(compareString(email, patients[patientAddress].email)){
            emit PatientFound(patientAddress);
            return false;
        }else{
            emit PatientNotFound(patientAddress);
        }
        Date memory date = Date(day,month,year);
        // Location memory location = Location(street,district,state);
        patientKeys.push(patientAddress);
        totalPatients =patientKeys.length ;
        bytes32 hashedPassword = hashPasswordWithSecret(password,patientSecret);
        patients[patientAddress] = PatientType(fname,lname,email,hashedPassword,location,date,patientAddress,false);
        emit PatientCreated(totalPatients, email);
        return true;
    }

    function updatePatient(address _patientId) public isOwner returns(bool){
        emit PatientUpdated(_patientId);
        return true;
    }

    function verifyPatientEmail() public isOwner returns(bool){
        patients[msg.sender].verfiedEmailAddress = true;
        emit PatientVerified(msg.sender,patients[msg.sender].verfiedEmailAddress);
        return true;
    }

    function deletePatient(address patientAddress) public isOwner() {
        delete patients[patientAddress];
        emit PatientDeleted(patientAddress);
    }

    // function deletePatient(address patientAddress) public isOwner() {
    //     require(patients[patientAddress].active, "Patient does not exist");
    //     patients[patientAddress].active = false;
    //     totalPatients-=1;
    //     emit PatientDeleted(patientAddress);
    // }

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

    function login(string memory email,string memory password,address walletAddress) public returns (bool){
        bool exists = true;
        for(uint i=0;i<totalPatients;i++){
            if(patientKeys[i]==walletAddress) exists = true;
        }
        bytes32 hashedPassword = hashPasswordWithSecret(password, patientSecret);
        if(exists){
            emit PatientFound(walletAddress);
        }else emit PatientNotFound(walletAddress);
        if(!compareString(patients[walletAddress].email,email) || patients[walletAddress].password != hashedPassword)
            return false;
        return exists;
    }

    function hashPasswordWithSecret(string memory password, string memory secret) public pure returns (bytes32) {
        bytes memory passwordBytes = bytes(password);
        bytes memory secretBytes = bytes(secret);
        return keccak256(abi.encodePacked(passwordBytes, secretBytes));
    }
}
