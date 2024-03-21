// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./patient.sol";
import "./doctor.sol";
import "./worker.sol";
import "./user.sol";

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

    ReportType[] testReports;

    struct AccessRequest {
        uint id;
        string reportId;
        address sentBy;
        address receivedBy;
        uint createdAt;
        uint updatedAt;
        RequestStatus status;
    }

    struct verficationRequestType {
        string reportId;
        address patientAddress;
        address verfiedBy;
        uint createdAt;
        uint updatedAt;
        RequestStatus status;
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
    mapping(string => verficationRequestType[]) public verficationRequests;

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
        if(!success) revert("only worker delegate call failed");
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
    event ReportVerified(string reportId);
    event NotSelfResource(address id,string reportId);

    event DoctorAssignedToReport(address doctorAddress, string reportId);
    event DoctorAccessRevoked(address doctorAddress, string reportId);

    event AccessRequestSent(address doctorAddress, string reportId,uint index);
    event AccessRequestApproved(address doctorAddress, string reportId,uint index);
    event AccessRequestRejected(address doctorAddress, string reportId,uint index);

    event VerificationRequestCreated(address patientAddress,string reportId);
    event VerificationRequestUpdated(address workerAddress,string reportId,RequestStatus r);
    event VerificationRequestDeleted(address workerAddress,string reportId);


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

    function sendAccessRequest(string memory reportId,address reciever,uint createdAt) public returns(bool) {
        bool hasAccess = false;
        for(uint i=0;i<reports[reportId].doctorAddress.length;i++){
            if(reports[reportId].doctorAddress[i]==msg.sender){
                hasAccess = true;
                break;
            }
        }
        if(hasAccess) revert("Doctor already has access to the file");        
        uint index = accessRequests[reportId].length;
        AccessRequest memory request = AccessRequest(index,reportId,msg.sender,reciever,createdAt,0,RequestStatus.pending);
        accessRequests[reportId].push(request);
        emit AccessRequestSent(msg.sender, reportId,index);
        return hasAccess;
    }

    function approveAccessRequest(uint256 requestId,string memory reportId) public onlyOwner(reportId) returns (bool){
        AccessRequest storage request = accessRequests[reportId][requestId];
        bool patientHasAccess = false;
        require(request.status != RequestStatus.pending, "Access request is not pending");
        bool alreadyHasAccess = false;
        for(uint i=0;i<reports[reportId].doctorAddress.length;i++){
            if(request.receivedBy==reports[reportId].doctorAddress[i]){
                alreadyHasAccess = true;
                break;
            }
        }
        if(alreadyHasAccess) revert("user already has access to the report");
        request.status = RequestStatus.approved;
        accessRequests[reportId][requestId] = request;
        reports[reportId].doctorAddress.push(request.receivedBy);
        emit AccessRequestApproved(request.receivedBy, reportId,requestId);
        return true;
    }

    function rejectAccessRequest(uint256 requestId,string memory reportId) public onlyOwner(reportId) returns(bool) {
        AccessRequest storage request = accessRequests[reportId][requestId];
        require(request.status != RequestStatus.pending, "Access request is not pending");
        request.status = RequestStatus.rejected;
        accessRequests[reportId][requestId] = request;
        reports[reportId].doctorAddress.push(request.receivedBy);
        emit AccessRequestRejected(request.receivedBy, reportId,requestId);
        return true;
    }

    function getAccessRequestStatus(string memory reportId,uint requestId) external view returns (RequestStatus) {
        return accessRequests[reportId][requestId].status;
    }

    function getAccessRequestStatusForReport(string memory reportId) public view returns(AccessRequest[] memory){
        return accessRequests[reportId];
    }

    function createVerificationRequest(string memory reportId,uint timestamp) public returns(bool){
        string[] memory patientReports = patientToReportMapping[msg.sender];
        bool owns = false;
        for(uint i=0;i<patientReports.length;i++){
            if(keccak256(abi.encodePacked(patientReports[i])) == keccak256(abi.encodePacked(reportId))){
                owns = true;
                break;
            }
        }
        if(owns){
            if(reports[reportId].isVerified){
                emit ReportVerified(reportId);
                return false;
            }
            verficationRequestType memory v = verficationRequestType(reportId,msg.sender,address(0),timestamp,0,RequestStatus.pending);
            verficationRequests[reportId].push(v);
            emit VerificationRequestCreated(msg.sender,reportId);
            return true;
        }else{
            emit NotSelfResource(msg.sender,reportId);
            return false;
        }
    }

    function deleteReport(string memory reportId) public returns(bool){
        bool owns = false;
        string[] memory patientReports = patientToReportMapping[msg.sender];
        for(uint i=0;i<patientReports.length;i++){
            if(keccak256(abi.encodePacked(patientReports[i])) == keccak256(abi.encodePacked(reportId))){
                owns = true;
                break;
            }
        }
        return true;
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
    
    function getVerificationRequest(address userAddress) public view returns(verficationRequestType[][] memory){
        uint count = 0;
        string[] memory reportId = patientToReportMapping[userAddress];

        for(uint i=0;i<reportId.length;i++){
            count += verficationRequests[reportId[i]].length;
        }

        verficationRequestType[][] memory vr = new verficationRequestType[][](count);
        for(uint i=0;i<reportId.length;i++){
            for(uint j=0;j<verficationRequests[reportId[i]].length;j++){
                verficationRequestType[] memory vri = verficationRequests[reportId[i]];
                vr[i][j] = vri[j]; 
            }
        }
        return vr;
    }

    function getVerificationRequestForReport(string memory reportId) public view returns(verficationRequestType[] memory){
        return verficationRequests[reportId];
    }

    function createTempReport(string memory problem,string[] memory attachement,string[] memory tags) public returns(bool){
        string memory reportId = randomString(15);
        reportKeys.push(reportId);
        address[] memory accessedDoctors;
        string[] memory diagnosis;
        ReportType memory report = ReportType(reportId,msg.sender,accessedDoctors,attachement,diagnosis,tags,false,problem);
        reports[reportId] = report;
        patientToReportMapping[msg.sender].push(reportId);
        emit reportCreated(reportId);
        return true;
    }

    function createReport(string memory problem,string[] memory attachement,string[] memory tags,uint role) public returns(bool){
        string memory reportId = randomString(15);
        reportKeys.push(reportId);
        address[] memory accessedDoctors;
        string[] memory diagnosis;
        bool isVerfied = false;
        if(role==2||role==3){
            isVerfied = true;
        }
        ReportType memory report = ReportType(reportId,msg.sender,accessedDoctors,attachement,diagnosis,tags,isVerfied,problem);
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

    function getPatientReports(address patientAddress) public view returns (ReportType[] memory) {
        ReportType[] memory foundReports = new ReportType[](patientToReportMapping[patientAddress].length);
        for (uint i = 0; i < reportKeys.length; i++) {
            if (reports[reportKeys[i]].patientAddress == patientAddress) {
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

