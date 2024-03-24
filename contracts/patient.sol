// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Patient {
    uint totalPatients = 0;
    address userAddress;
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
        string location;
        string gender;
        bool isVerified;
        uint height;
        uint weight;
        uint DoB;
        string mobileNo;
        address walletAddress;
    }

    struct PatientDeleteRequest{
        uint requestedTimestamp;
        uint modifiedTimestamp;
        status requestStatus;
        address patientAddress;
        string reason;
    }

    constructor(address userContractAddress){
        userAddress = userContractAddress;
    }

    modifier isWorker(){
        (bool success, bytes memory data) = userAddress.delegatecall(
            abi.encodeWithSignature("getData()")
        );
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
        string memory fname,
        string memory lname,
        string memory email,
        string memory mobileNo,
        string memory gender,
        uint height,uint weight,
        uint date,
        string memory location,
        address patientAddress
        ) public returns (bool) {
        if(compareString(email, patients[patientAddress].email)){
            emit PatientFound(patientAddress);
            return false;
        }else{
            emit PatientNotFound(patientAddress);
        }
        patientKeys.push(patientAddress);
        totalPatients =patientKeys.length ;
        patients[patientAddress] = PatientType(fname,lname,email,location,gender,true,height,weight,date,mobileNo,patientAddress);
        emit PatientCreated(totalPatients, email);
        return true;
    }

    function updatePatient(address _patientId) public isOwner returns(bool){
        emit PatientUpdated(_patientId);
        return true;
    }

    function deletePatient(address patientAddress) public isOwner{
        delete patients[patientAddress];
        emit PatientDeleted(patientAddress);
    }

    function getSelfDetails(address walletAddress) public view returns(PatientType memory){
        require(patients[walletAddress].walletAddress==walletAddress,"User doesn't exists as patient");
        return patients[walletAddress];
    }

    function getPatient(address patientAddress) public view returns (PatientType memory) {
        return patients[patientAddress];
    }

    function getAllPatient() public view returns(PatientType[] memory) {
        PatientType[] memory allPatients = new PatientType[](totalPatients);
        for(uint i=0;i<totalPatients;i++){
            allPatients[i] = patients[patientKeys[i]];
        }
        return allPatients;
    }

    function verifyUser(address walletAddress,bool updatedStatus) public returns (bool){
        if(updatedStatus) patients[walletAddress].isVerified = true;
        return true;
    }

}
