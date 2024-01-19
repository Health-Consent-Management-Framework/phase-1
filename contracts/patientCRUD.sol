// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecordSystem {

    address public owner;

    struct Patient {
        string name;
        uint256 age;
        uint256 patientId;
        address doctorAccess;
    }

    mapping(uint256 => Patient) public patients;
    uint256 public totalPatients;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyDoctor(uint256 patientId) {
        require(
            msg.sender == patients[patientId].doctorAccess,
            "Only the authorized doctor can access this record"
        );
        _;
    }

    event PatientCreated(uint256 patientId, string name, uint256 age);
    event PatientUpdated(uint256 patientId, string newName, uint256 newAge);
    event PatientDeleted(uint256 patientId);

    constructor() {
        require(msg.sender != address(0), "Null address not allowed");
        owner = msg.sender;
    }

    function createPatient(string memory _name, uint256 _age) external onlyOwner {
        totalPatients++;
        patients[totalPatients] = Patient({
            name: _name,
            age: _age,
            patientId: totalPatients,
            doctorAccess: address(0)
        });

        emit PatientCreated(totalPatients, _name, _age);
    }

    function updatePatient(uint256 _patientId, string memory _newName, uint256 _newAge)
        external
        onlyOwner
        onlyDoctor(_patientId)
    {
        Patient storage patient = patients[_patientId];
        patient.name = _newName;
        patient.age = _newAge;

        emit PatientUpdated(_patientId, _newName, _newAge);
    }

    function deletePatient(uint256 _patientId) external onlyOwner {
        require(_patientId <= totalPatients && _patientId > 0, "Invalid patient ID");

        delete patients[_patientId];

        emit PatientDeleted(_patientId);
    }

    function grantAccessToDoctor(uint256 _patientId, address _doctorAddress) external onlyOwner {
        require(_patientId <= totalPatients && _patientId > 0, "Invalid patient ID");

        patients[_patientId].doctorAccess = _doctorAddress;
    }

    function getPatient(uint256 _patientId) external view onlyDoctor(_patientId) returns (Patient memory) {
        return patients[_patientId];
    }
}
