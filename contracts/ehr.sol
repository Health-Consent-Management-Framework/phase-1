// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./patient.sol";
import "./doctor.sol";
import "./worker.sol";
import "./user.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Report {
    address patientContractAddress;
    address doctorContractAddress;
    address workerContractAddress;
    address userContractAddress;
    
    uint totalReports;
    uint counter = 1;

    struct PatientType{
        string fname;
        string lname;
    }

    struct DoctorType{
        string fname;
        string lname;
        string designation;
    }

    enum RequestStatus { pending, approved, rejected }
    enum UploadStatus { pending, uploaded, rejected }

    struct AccessRequest {
        uint accessRequestId;
        address doctorAddress;
        string reportId;
        RequestStatus status;
    }

    struct UploadRequest {
        address patientAddress;
        UploadStatus status;
    }

    struct CompleteReportInfo{
        AccessRequest[] requests;
        PatientType patientDetais;
        DoctorType doctorDetails;
        ReportType reportinfo;
    }

    struct ReportType{
        string reportId;
        address patientAddress;
        address diagnoisedDoctor;
        address[] doctorAddress;
        string[] attachements;
        string[] diagnosis;
        string[] tags;   
        uint createdAt;
        uint updatedAt;
    }
    uint256 private nonce;
    mapping(address => DoctorType) public doctors;
    mapping(address=>string[]) private patientToReportMapping;
    mapping(string => AccessRequest[]) public accessRequests;
    string[] reportKeys;
    mapping(string => ReportType) public reports;

    modifier onlyOwner(string memory reportId) {
        require(msg.sender == reports[reportId].patientAddress, "User doesn't own the report");
        _;
    }

    modifier onlyDoctorWithAccess(string memory reportId) {
        bool isdoctor = false;
        for(uint i=0;i<reports[reportId].doctorAddress.length;i++){
            if(msg.sender==reports[reportId].doctorAddress[i]){
                isdoctor = true;
                break;
            }
        }
        require(isdoctor, "Only registered doctors can access this function");
        _;
    }

    modifier onlyDoctor(){
        (bool success,bytes memory data) = doctorContractAddress.delegatecall(abi.encodeWithSignature("checkIfDoctor(address)",msg.sender)); 
        if(!success) revert("only worker delegate call failer");
        bool isWorker = abi.decode(data, (bool));
        require(bool(isWorker),"only worker has access to this request");
        _;
    }

    modifier onlyWorkerOrAdmin(){
        (bool adminSuccess,bytes memory adminData) = workerContractAddress.delegatecall(abi.encodeWithSignature("checkIfWorker(address)",msg.sender)); 
        if(!adminSuccess) revert("only worker delegate call failer");
        (bool workerSuccess,bytes memory workerData) = workerContractAddress.delegatecall(abi.encodeWithSignature("checkIfWorker(address)",msg.sender)); 
        bool isAdmin = abi.decode(adminData, (bool));
        bool isWorker = abi.decode(workerData,(bool));
        require(bool(isWorker)||bool(isAdmin),"only worker has access to this request");
        _;
    }

    event reportCreated(string reportId);
    event reportUpdate(string reportId);

    event DoctorAssignedToReport(address doctorAddress, string reportId);
    event DoctorAccessRevoked(address doctorAddress, string reportId);

    event AccessRequestSent(address doctorAddress, string reportId,uint index);
    event AccessRequestApproved(address doctorAddress, string reportId,uint index);
    event AccessRequestRejected(address doctorAddress, string reportId,uint index);

    constructor(address _patientAddress,address _doctorAddress,address _workerAddress,address _userAddress) {
        patientContractAddress = _patientAddress;
        doctorContractAddress = _doctorAddress;
        userContractAddress = _userAddress;
        workerContractAddress = _workerAddress;
        totalReports = 0;
    }

    function revokeDoctorAccessToPatient(string memory reportId,address doctorAddress) public returns (bool){
        ReportType storage report = reports[reportId];
        bool success = false;
        for(uint i=0;i<report.doctorAddress.length;i++){
            if(report.doctorAddress[i]==doctorAddress){ 
                success = true;
                (report.doctorAddress[i],report.doctorAddress[report.doctorAddress.length - 1]) = (report.doctorAddress[i],report.doctorAddress[report.doctorAddress.length - 1]);
                report.doctorAddress.pop();
                break; 
            }
        }
        if(success) emit DoctorAccessRevoked(doctorAddress, reportId);
        else revert("given doctor doesn't have access to the file");
        return success;
    }

    function sendAccessRequest(string memory reportId) public onlyDoctor returns(bool) {
        bool hasAccess = false;
        for(uint i=0;i<reports[reportId].doctorAddress.length;i++){
            if(reports[reportId].doctorAddress[i]==msg.sender){
                hasAccess = true;
                break;
            }
        }
        if(hasAccess) revert("Doctor already has access to the file");        
        uint index = accessRequests[reportId].length;
        AccessRequest memory request = AccessRequest(index,msg.sender,reportId,RequestStatus.pending);
        accessRequests[reportId].push(request);
        emit AccessRequestSent(msg.sender, reportId,index);
        return hasAccess;
    }

    function approveAccessRequest(uint256 requestId,string memory reportId) public onlyOwner(reportId) returns (bool){
        AccessRequest storage request = accessRequests[reportId][requestId];
        require(request.status != RequestStatus.pending, "Access request is not pending");
        bool alreadyHasAccess = false;
        for(uint i=0;i<reports[reportId].doctorAddress.length;i++){
            if(request.doctorAddress==reports[reportId].doctorAddress[i]){
                alreadyHasAccess = true;
                break;
            }
        }
        if(alreadyHasAccess) revert("user already has access to the report");
        request.status = RequestStatus.approved;
        accessRequests[reportId][requestId] = request;
        reports[reportId].doctorAddress.push(request.doctorAddress);
        emit AccessRequestApproved(request.doctorAddress, reportId,requestId);
        return true;
    }

    function rejectAccessRequest(uint256 requestId,string memory reportId) public onlyOwner(reportId) returns(bool) {
        AccessRequest storage request = accessRequests[reportId][requestId];
        require(request.status != RequestStatus.pending, "Access request is not pending");
        request.status = RequestStatus.rejected;
        accessRequests[reportId][requestId] = request;
        reports[reportId].doctorAddress.push(request.doctorAddress);
        emit AccessRequestRejected(request.doctorAddress, reportId,requestId);
        return true;
    }

    function getAccessRequestStatus(string memory reportId,uint requestId) external view returns (RequestStatus) {
        return accessRequests[reportId][requestId].status;
    }

    function getAccessRequestStatusForReport(string memory reportId) public view returns(AccessRequest[] memory){
        return accessRequests[reportId];
    }

    function generateRandomId(uint256 givenNumber) public returns (string memory) {
        bytes memory characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, nonce))) % 100;
        nonce++;
        string memory randomId = string(abi.encodePacked("RT", Strings.toString(randomNumber), getRandomLetters(characters), Strings.toString(givenNumber)));
        return randomId;
    }

    function getRandomLetters(bytes memory characters) private view returns (string memory) {
        bytes memory randomLetters = new bytes(3);
        for (uint256 i = 0; i < 3; i++) {
            uint256 index = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, nonce, i))) % characters.length;
            randomLetters[i] = characters[index];
        }
        return string(randomLetters);
    }


    function createReport(string memory email,address patientAddress) public onlyWorkerOrAdmin returns(bool){
        (bool success,bytes memory data) = userContractAddress.delegatecall(abi.encodeWithSignature("emailToUser(string)", email));
        if(!success) revert("delegate call failed");
        address resultAddress = abi.decode(data, (address));
        string memory reportId = generateRandomId(patientToReportMapping[patientAddress].length);
        reportKeys.push(reportId);
        // address[] memory accessedDoctors;
        uint createdAt = 0;
        uint updatedAt = 0;
        // string[] memory attachements;
        string[] memory diagnosis;
        // string[] memory tags;
        ReportType memory report = ReportType(reportId,resultAddress,address(0),new address[](0),new string[](0),diagnosis,new string[](0),createdAt,updatedAt);
        reports[reportId] = report;
        patientToReportMapping[resultAddress].push(reportId);
        emit reportCreated(reportId);
        return true;
    }

    function createTempReport(string memory email) public returns(bool){
        (bool success,bytes memory data) = userContractAddress.delegatecall(abi.encodeWithSignature("emailToUser(string)", email));
        if(!success) revert("delegate call failed");
        address resultAddress = abi.decode(data, (address));
        string memory reportId = generateRandomId(patientToReportMapping[msg.sender].length);
        reportKeys.push(reportId);
        address[] memory accessedDoctors;
        uint createdAt = 0;
        uint updatedAt = 0;
        string[] memory attachements;
        string[] memory diagnosis;
        string[] memory tags;
        ReportType memory report = ReportType(reportId,resultAddress,address(0),accessedDoctors,attachements,diagnosis,tags,createdAt,updatedAt);
        reports[reportId] = report;
        patientToReportMapping[resultAddress].push(reportId);
        emit reportCreated(reportId);
        return true;
    }

    function updateReport(string memory reportId,string[] memory newDiagnosis) public onlyDoctorWithAccess(reportId) returns (bool) {
        ReportType memory report = reports[reportId];
        report.diagnosis = newDiagnosis;
        report.updatedAt = block.timestamp;
        reports[reportId] = report;
        emit reportUpdate(reportId);
        return true;
    }

    function getPatientReports() public view returns (ReportType[] memory) {
        ReportType[] memory foundReports = new ReportType[](patientToReportMapping[msg.sender].length);
        for (uint i = 0; i < reportKeys.length; i++) {
            if (reports[reportKeys[i]].patientAddress == msg.sender) {
                foundReports[i] = reports[reportKeys[i]];
            }
        }
        return foundReports;
    }

    function updateTags(string memory reportId,string[] memory tags) public onlyOwner(reportId) returns(bool) {
        ReportType memory report = reports[reportId];
        if(report.patientAddress != msg.sender) revert("user doesnot owne the resource to signin");
        report.tags = tags;
        report.updatedAt = block.timestamp;
        reports[reportId] = report;
        emit reportUpdate(reportId);
        return true;
    }

    function getRequestKeys() private view returns(string[] memory){
        return reportKeys;
    }
}

