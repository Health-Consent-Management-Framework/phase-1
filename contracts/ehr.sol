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
        address[] doctorAddress;
        string[] attachements;
        string[] diagnosis;
        string[] tags;
        bool isVerified;
        string problem;
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

    function randomString(uint size) public  payable returns(string memory){
        bytes memory randomWord=new bytes(size);
        // since we have 26 letters
        bytes memory chars = new bytes(26);
        chars="abcdefghijklmnopqrstuvwxyz";
        for (uint i=0;i<size;i++){
            uint randomNumber=random(26);
            // Index access for string is not possible
            randomWord[i]=chars[randomNumber];
        }
        return string(randomWord);
    }

    function random(uint number) public payable returns(uint){
        counter++;
        return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  
        msg.sender,counter))) % number;
    }


    function createTempReport(string memory problem,string[] memory attachement,string[] memory tags) public returns(bool){
        string memory reportId = randomString(15);
        reportKeys.push(reportId);
        address[] memory accessedDoctors;
        // uint createdAt = 0;
        // uint updatedAt = 0;
        string[] memory diagnosis;
        ReportType memory report = ReportType(reportId,msg.sender,accessedDoctors,attachement,diagnosis,tags,false,problem);
        reports[reportId] = report;
        patientToReportMapping[msg.sender].push(reportId);
        emit reportCreated(reportId);
        return true;
    }

    function updateReport(string memory reportId,string[] memory newDiagnosis) public onlyDoctorWithAccess(reportId) returns (bool) {
        ReportType memory report = reports[reportId];
        report.diagnosis = newDiagnosis;
        // report.updatedAt = block.timestamp;
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
        // report.updatedAt = block.timestamp;
        reports[reportId] = report;
        emit reportUpdate(reportId);
        return true;
    }

    function getRequestKeys() private view returns(string[] memory){
        return reportKeys;
    }
}

