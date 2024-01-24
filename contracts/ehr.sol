// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DoctorAccessControl {
    address public owner;

    enum RequestStatus { Pending, Approved, Rejected }

    struct Doctor {
        string name;
        address doctorAddress;
    }

    struct AccessRequest {
        address doctorAddress;
        uint256 patientId;
        RequestStatus status;
    }

    mapping(address => Doctor) public doctors;
    mapping(uint256 => address) public patientToDoctor;
    mapping(uint256 => AccessRequest) public accessRequests;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyDoctor() {
        require(doctors[msg.sender].doctorAddress != address(0), "Only registered doctors can access this function");
        _;
    }

    event DoctorRegistered(address doctorAddress, string name);
    event DoctorAssignedToPatient(address doctorAddress, uint256 patientId);
    event DoctorAccessRevoked(address doctorAddress, uint256 patientId);
    event AccessRequestSent(address doctorAddress, uint256 patientId);
    event AccessRequestApproved(address doctorAddress, uint256 patientId);
    event AccessRequestRejected(address doctorAddress, uint256 patientId);

    constructor() {
        owner = msg.sender;
    }

    function registerDoctor(string memory _name) external {
        require(doctors[msg.sender].doctorAddress == address(0), "Doctor already registered");

        doctors[msg.sender] = Doctor({
            name: _name,
            doctorAddress: msg.sender
        });

        emit DoctorRegistered(msg.sender, _name);
    }

    function assignDoctorToPatient(address _doctorAddress, uint256 _patientId) external onlyOwner {
        require(_doctorAddress != address(0), "Invalid doctor address");
        require(_patientId > 0, "Invalid patient ID");

        patientToDoctor[_patientId] = _doctorAddress;

        emit DoctorAssignedToPatient(_doctorAddress, _patientId);
    }

    function revokeDoctorAccessToPatient(uint256 _patientId) external onlyOwner {
        require(_patientId > 0, "Invalid patient ID");

        address doctorAddress = patientToDoctor[_patientId];
        require(doctorAddress != address(0), "No doctor assigned to this patient");

        delete patientToDoctor[_patientId];

        emit DoctorAccessRevoked(doctorAddress, _patientId);
    }

    function sendAccessRequest(uint256 _patientId) external onlyDoctor {
        require(_patientId > 0, "Invalid patient ID");
        require(patientToDoctor[_patientId] == msg.sender, "You are not assigned to this patient");

        AccessRequest storage request = accessRequests[_patientId];
        require(request.status == RequestStatus.Pending, "Access request already sent or approved");

        request.doctorAddress = msg.sender;
        request.patientId = _patientId;
        request.status = RequestStatus.Pending;

        emit AccessRequestSent(msg.sender, _patientId);
    }

    function approveAccessRequest(uint256 _patientId) external onlyOwner {
        require(_patientId > 0, "Invalid patient ID");

        AccessRequest storage request = accessRequests[_patientId];
        require(request.status == RequestStatus.Pending, "Access request is not pending");
        request.status = RequestStatus.Approved;

        patientToDoctor[_patientId] = request.doctorAddress;

        emit AccessRequestApproved(request.doctorAddress, _patientId);
    }

    function rejectAccessRequest(uint256 _patientId) external onlyOwner {
        require(_patientId > 0, "Invalid patient ID");

        AccessRequest storage request = accessRequests[_patientId];
        require(request.status == RequestStatus.Pending, "Access request is not pending");
        request.status = RequestStatus.Rejected;

        emit AccessRequestRejected(request.doctorAddress, _patientId);
    }

    function getAccessRequestStatus(uint256 _patientId) external view returns (RequestStatus) {
        return accessRequests[_patientId].status;
    }
}
