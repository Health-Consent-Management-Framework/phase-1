// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

import "./user.sol";

contract Doctor{

    struct Date{
        uint date;
        uint month;
        uint year;
    }

    uint totalDoctors = 0;
    User userContract;
    string doctorSecret = 'doctor123';

    struct DoctorType{
        string fname;
        string lname;
        string designation;
        string[] degree;
        string email;
        string mobileNo;
        bool doctorVerified;
        address walletAddress; 
        uint DoB;
        address[] patients; 
    }

    struct DoctorInfo{
        string fname;
        string lname;
        string designation;
        string[] degree;
        string email;
    }

    mapping(address => DoctorType) public doctors;
    
    mapping(address=>string[]) public accountRequests;

    address[] private doctorKeys;
    mapping(address => mapping(address => bool)) public patientRequests; // Mapping to track patient requests sent by doctors

    event DoctorCreated(address indexed doctorAddress);
    event DoctorUpdated(address indexed doctorAddress);
    event DoctorNotFound(address indexed doctorAddress);
    event DoctorRemoved(address indexed doctorAddress);
    event PatientRequestSent(address indexed doctorAddress, address indexed patientAddress);
    event PatientRequestAccepted(address indexed doctorAddress, address indexed patientAddress);
    event PatientRequestRejected(address indexed doctorAddress, address indexed patientAddress);

    modifier onlyDoctor() {
        require(doctors[msg.sender].walletAddress != address(0), "Caller is not a registered doctor");
        _;
    }

    function editDoctor(string memory fname, string memory lname, string memory designation, string[] memory degree, string memory email,uint date) public onlyDoctor returns (bool) {
        // Implement editing functionality
        doctors[msg.sender].fname = fname;
        doctors[msg.sender].lname = lname;
        doctors[msg.sender].designation = designation;
        doctors[msg.sender].degree = degree;
        doctors[msg.sender].email = email;
        doctors[msg.sender].DoB = date;
        emit DoctorUpdated(msg.sender);
        return true;
    }
    
    function deleteDoctor() public onlyDoctor returns (bool) {
        // Implement deletion functionality
        delete doctors[msg.sender];
        emit DoctorRemoved(msg.sender);
        return true;
    }

    function createDoctor(string memory fname, 
                            string memory lname, 
                            string memory email,
                            string memory mobileNo, 
                            string memory designation, 
                            string[] memory degree, 
                            uint date,
                            address walletAddress
                        ) public returns(bool) {
        if(doctors[walletAddress].walletAddress==address(0)){
            emit DoctorNotFound(walletAddress);
        }
        require(doctors[walletAddress].walletAddress == address(0), "Doctor with provided wallet address already exists");
        address[] memory patientAddress = new address[](0);
        doctors[walletAddress] = DoctorType(fname, lname, designation, degree, email, mobileNo, false, walletAddress,date,patientAddress);
        emit DoctorCreated(walletAddress);
        return true;
    }


    function addPatientToDoctor(address doctorAddress, address patientAddress) public onlyDoctor returns(bool) {
        require(doctors[doctorAddress].walletAddress != address(0), "Invalid doctor address");
        doctors[doctorAddress].patients.push(patientAddress);
        return true;
    }

    function getPatientsUnderDoctor(address doctorAddress) public view returns (address[] memory) {
        require(doctors[doctorAddress].walletAddress != address(0), "Invalid doctor address");
        return doctors[doctorAddress].patients;
    }

    function sendRequestToPatient(address patientAddress) public onlyDoctor returns(bool) {
        // Implement sending patient request functionality
        require(patientAddress != address(0), "Invalid patient address");
        require(!patientRequests[msg.sender][patientAddress], "Patient request already sent");
        patientRequests[msg.sender][patientAddress] = true;
        emit PatientRequestSent(msg.sender, patientAddress);
        return true;
    }

    function acceptPatientRequest(address doctorAddress) public returns(bool) {
        // Implement accepting patient request functionality
        require(doctors[doctorAddress].walletAddress != address(0), "Invalid doctor address");
        require(patientRequests[doctorAddress][msg.sender], "No pending request from patient");
        doctors[doctorAddress].patients.push(msg.sender);
        delete patientRequests[doctorAddress][msg.sender];
        emit PatientRequestAccepted(doctorAddress, msg.sender);
        return true;
    }

    function rejectPatientRequest(address doctorAddress) public returns(bool) {
        // Implement rejecting patient request functionality
        require(doctors[doctorAddress].walletAddress != address(0), "Invalid doctor address");
        require(patientRequests[doctorAddress][msg.sender], "No pending request from patient");
        delete patientRequests[doctorAddress][msg.sender];
        emit PatientRequestRejected(doctorAddress, msg.sender);
        return true;
    }

    function getDoctorInfo(address doctorAddress) public view returns (DoctorInfo memory) {
        DoctorType memory completeInfo = doctors[doctorAddress];
        DoctorInfo memory doctorInfo;
        doctorInfo.fname = completeInfo.fname;
        doctorInfo.lname = completeInfo.lname;
        doctorInfo.designation = completeInfo.designation;
        doctorInfo.degree = completeInfo.degree;
        doctorInfo.email = completeInfo.email;
        return doctorInfo;
    }

    function getDoctors(address doctorAddress) public view returns (DoctorType memory){
        return doctors[doctorAddress];
    }

    function checkIfDoctor(address doctorAddress) public view returns(bool) {
        return doctors[doctorAddress].walletAddress != address(0);
    }

    function getAllDoctors() public view returns (DoctorType[] memory){
        DoctorType[] memory doctorsData = new DoctorType[](doctorKeys.length);
        uint index = 0;
        for(uint i=0;i<doctorKeys.length;i++){
            if(doctorKeys[i]!=address(0)){
                doctorsData[index] = doctors[doctorKeys[i]];
                index++;
            }
        }
        return doctorsData;
    }

    function compareString(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

}