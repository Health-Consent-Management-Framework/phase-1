// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import './worker.sol';

contract Patient {

    Worker workerContract;
    uint totalPatients;
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
    mapping(address=> PatientDeleteRequest) public patientDeleteRequests;


    event PatientCreated(uint256 totalPatients, string email);
    event PatientFound(address patientAddress);
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
            revert("patient with given email already exists");
        }
        Date memory date = Date(day,month,year);
        // Location memory location = Location(street,district,state);
        patientKeys[totalPatients] = patientAddress;
        totalPatients+=1;
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

    function login(string memory email,string memory password,address walletAddress) public returns (bool){
        bool exists = true;
        for(uint i=0;i<totalPatients;i++){
            if(patientKeys[i]==walletAddress) exists = true;
        }
        bytes32 hashedPassword = hashPasswordWithSecret(password, patientSecret);
        if(exists){
            emit PatientFound(walletAddress);
        }
        if(!compareString(patients[walletAddress].email,email) || patients[walletAddress].password != hashedPassword)
            revert("incorrect email or password");
        return true;
    }

    function hashPasswordWithSecret(string memory password, string memory secret) public pure returns (bytes32) {
        bytes memory passwordBytes = bytes(password);
        bytes memory secretBytes = bytes(secret);
        return keccak256(abi.encodePacked(passwordBytes, secretBytes));
    }

    function createToken(string memory username, string memory password, uint256 expirationTime, string memory secret) public pure returns (bytes32) {
        string memory concatenatedString = string(abi.encodePacked(username, ".", password, ".", expirationTime, ".", secret));
        return keccak256(bytes(concatenatedString));
    }
}
