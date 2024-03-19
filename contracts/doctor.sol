// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

contract Doctor{

    struct Date{
        uint date;
        uint month;
        uint year;
    }

    uint totalDoctors = 0;
    string doctorSecret = 'doctor123';

    struct DoctorType{
        string fname;
        string lname;
        string designation;
        string[] degree;
        string email;
        bytes32 password;
        bool verifiedEmail;
        bool doctorVerified;
        address walletAddress; 
        Date DoB;
        address[] patients; // Patients treated by this doctor
    }

    struct DoctorInfo{
        string fname;
        string lname;
        string designation;
        string[] degree;
        string email;
    }

    mapping(address => DoctorType) public doctors;
    mapping(address => mapping(address => bool)) public patientRequests; // Mapping to track patient requests sent by doctors

    event DoctorCreated(address indexed doctorAddress);
    event DoctorUpdated(address indexed doctorAddress);
    event DoctorRemoved(address indexed doctorAddress);
    event PatientRequestSent(address indexed doctorAddress, address indexed patientAddress);
    event PatientRequestAccepted(address indexed doctorAddress, address indexed patientAddress);
    event PatientRequestRejected(address indexed doctorAddress, address indexed patientAddress);

    modifier onlyDoctor() {
        require(doctors[msg.sender].walletAddress != address(0), "Caller is not a registered doctor");
        _;
    }

    function editDoctor(string memory fname, string memory lname, string memory designation, string[] memory degree, string memory email,uint day, uint month, uint year) public onlyDoctor returns (bool) {
        // Implement editing functionality
        doctors[msg.sender].fname = fname;
        doctors[msg.sender].lname = lname;
        doctors[msg.sender].designation = designation;
        doctors[msg.sender].degree = degree;
        doctors[msg.sender].email = email;
        // doctors[msg.sender].password = password;
        doctors[msg.sender].DoB = Date(day, month, year);
        emit DoctorUpdated(msg.sender);
        return true;
    }
    
    function deleteDoctor() public onlyDoctor returns (bool) {
        // Implement deletion functionality
        delete doctors[msg.sender];
        emit DoctorRemoved(msg.sender);
        return true;
    }

    function createDoctor(string memory fname, string memory lname, string memory email,string memory password,address walletAddress, uint day, uint month, uint year) public returns(bool) {
        require(doctors[walletAddress].walletAddress == address(0), "Doctor with provided wallet address already exists");
        bytes32 hashedPassword = hashPasswordWithSecret(password,doctorSecret);
        address[] memory patientAddress = new address[](0);
        string[] memory degrees = new string[](0);
        doctors[walletAddress] = DoctorType(fname, lname, '', degrees, email,hashedPassword,false, false, walletAddress, Date(day, month, year),patientAddress);
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

    function checkIfDoctor(address doctorAddress) public view returns(bool) {
        return doctors[doctorAddress].walletAddress != address(0);
    }

    
    function hashPasswordWithSecret(string memory password, string memory secret) public pure returns (bytes32) {
        bytes memory passwordBytes = bytes(password);
        bytes memory secretBytes = bytes(secret);
        return keccak256(abi.encodePacked(passwordBytes, secretBytes));
    }

    function compareString(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function login(string memory email,string memory password,address walletAddress) public view returns (bool,string memory){
        bool exists = true;
            if(doctors[walletAddress].walletAddress==walletAddress) exists = true;
            bytes32 hashedPassword = hashPasswordWithSecret(password, doctorSecret);
        if(exists){ 
            if(!compareString(doctors[walletAddress].email,email) || doctors[walletAddress].password != hashedPassword)
                return (false,"check your credentials");
            if(doctors[walletAddress].doctorVerified) return (true,"verfied");
            else return (true,"not verifed");
        }else return(false,"not verfied");
    }
}