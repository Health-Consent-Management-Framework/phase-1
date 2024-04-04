// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./user.sol";

contract Report {

    User userContract;
    
    uint totalReports;
    uint counter = 1;
    enum RequestStatus { pending, approved, rejected }
    enum RequestTypeEnum { verification, access}
    enum UploadStatus { pending, uploaded, rejected }

    ReportType[] testReports;

    struct RequestType {
        uint id;
        string reportId;
        address sentBy;
        address receivedBy;
        uint createdAt;
        uint updatedAt;
        RequestStatus status;
        RequestTypeEnum requestType;
    }

    struct Diagnosis{
        string text;
        uint date;
        string doctorFname;
        string doctorLname;
        address walletAddress;
    }


    struct ReportType{
        string reportId;
        address patientAddress;
        address[] doctorAddress;
        string[] attachements;
        string[] tags;
        bool isVerified;
        string problem;
        uint createdAt;
        uint updatedAt;
    }

    uint256 private nonce;
    mapping(address => string[]) private userToReportMapping;
    mapping(address => string[]) doctorToReportMapping;
    mapping(string => RequestType[]) public accessRequests;
    mapping(string=>string[]) reportToDiagnosis; 
    mapping(string=> Diagnosis) reportDiagnosis; // reportId->diagnosis
    // mapping(uint=>RequestType) public accessRequestsMapping;
    string[] reportKeys; // fetch all reports
    string[] requestKeys;
    Diagnosis[] testDiagnosis;
    mapping(string => ReportType) public reports;

    modifier onlyOwner(address userAddress,string memory reportId) {
        if(userAddress == reports[reportId].patientAddress){
        _;
        }else emit NotSelfResource(userAddress,reportId);
    }

    modifier onlyDoctorWithAccess(address doctorAddress,string memory reportId) {
        bool isdoctor = false;
        for(uint i=0;i<reports[reportId].doctorAddress.length;i++){
            if(doctorAddress == reports[reportId].doctorAddress[i]){
                isdoctor = true;
                break;
            }
        }
        if(isdoctor) _;
        else emit NoAccessToReport(doctorAddress,reportId);
    }

    modifier onlyWorkerOrAdmin(address userAddress){
        bool isAdmin = userContract.getVerificationStatus(userAddress, 1);
        bool isWorker = userContract.getVerificationStatus(userAddress, 2);
        if(isAdmin||isWorker) _;
        else emit NotWorkerOrAdmin(userAddress);
    }

    event reportCreated(string reportId);
    event reportUpdate(string reportId);
    event ReportVerified(string reportId);
    event ReportAlreadyVerified(string reportId);
    event NotSelfResource(address id,string reportId);
    event NoAccessToReport(address id,string reportId);

    event NotDoctor(address id);
    event NotWorkerOrAdmin(address id);

    event DoctorAssignedToReport(address doctorAddress, string reportId);
    event DoctorAccessRevoked(address doctorAddress, string reportId);

    event AccessRequestSent(address doctorAddress, string reportId,uint index);
    event AccessRequestApproved(address doctorAddress, string reportId,uint index);
    event AccessRequestRejected(address doctorAddress, string reportId,uint index);

    event VerificationRequestCreated(address patientAddress,string reportId);
    event VerificationRequestUpdated(address workerAddress,string reportId,RequestStatus r);
    event VerificationRequestDeleted(address workerAddress,string reportId);


    constructor(address _userAddress) {
        userContract = User(_userAddress); 
        totalReports = 0;
    }

    function revokeDoctorAccessToPatient(string memory reportId, address doctorAddress) public returns (bool) {
        ReportType storage report = reports[reportId];
        bool success = false;
        for(uint i = 0; i < report.doctorAddress.length; i++) {
            if(report.doctorAddress[i] == doctorAddress) { 
                success = true;
                report.doctorAddress[i] = report.doctorAddress[report.doctorAddress.length - 1];
                report.doctorAddress.pop();
                emit DoctorAccessRevoked(doctorAddress, reportId);
                break; 
        }
    }
        require(success, "Given doctor doesn't have access to the file");
        return success;
    }

    function grantDoctorAccess(string memory reportId,address doctorAddress) public returns (bool){
        uint size = reports[reportId].doctorAddress.length;
        for(uint i=0;i<size;i++){
            if(reports[reportId].doctorAddress[i]==doctorAddress) return false;
        }
        reports[reportId].doctorAddress.push(doctorAddress);
        doctorToReportMapping[doctorAddress].push(reportId);
        return true;
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
        RequestType memory request = RequestType(index,reportId,msg.sender,reciever,createdAt,0,RequestStatus.pending,RequestTypeEnum.access);
        accessRequests[reportId].push(request);
        emit AccessRequestSent(msg.sender, reportId,index);
        return hasAccess;
    }

    function approveAccessRequest(uint256 requestId,string memory reportId) public onlyOwner(msg.sender,reportId) returns (bool){
        RequestType storage request = accessRequests[reportId][requestId];
        // require(request.status != RequestStatus.pending, "Access request is not pending");
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
        doctorToReportMapping[msg.sender].push(reportId);
        emit AccessRequestApproved(request.receivedBy, reportId,requestId);
        return true;
    }

    function rejectAccessRequest(uint256 requestId,string memory reportId) public onlyOwner(msg.sender,reportId) returns(bool) {
        RequestType storage request = accessRequests[reportId][requestId];
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

    function getAccessRequestStatusForReport(string memory reportId) public view returns(RequestType[] memory){
        return accessRequests[reportId];
    }

    function createVerificationRequest(string memory reportId,uint created_at) public returns(bool){
        string[] memory patientReports = userToReportMapping[msg.sender];
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
            uint index = accessRequests[reportId].length;
            RequestType memory v = RequestType(index,reportId,msg.sender,address(0),created_at,0,RequestStatus.pending,RequestTypeEnum.verification);
            accessRequests[reportId].push(v);
            emit VerificationRequestCreated(msg.sender,reportId);
            return true;
        }else{
            emit NotSelfResource(msg.sender,reportId);
            return false;
        }
    }

    function approveVerificationRequest(string memory reportId,uint requestId,uint updated_at) public returns(bool){
        if(userContract.getVerificationStatus(msg.sender, 1)||userContract.getVerificationStatus(msg.sender,2)){
            if(accessRequests[reportId][requestId].status == RequestStatus.pending){
                accessRequests[reportId][requestId].status = RequestStatus.approved;
                reports[reportId].isVerified = true;
                reports[reportId].updatedAt  = updated_at;
           }
        }
    }   

    function rejectVerificationRequset(string memory reportId,uint requestId,uint updated_at) public returns(bool){
        if(userContract.getVerificationStatus(msg.sender, 1)||userContract.getVerificationStatus(msg.sender,2)){
            if(accessRequests[reportId][requestId].status == RequestStatus.pending){
                accessRequests[reportId][requestId].status = RequestStatus.rejected;
           }
        }
    }

    function deleteReport(string memory reportId) public returns(bool){
        string[] memory userReports = userToReportMapping[msg.sender];
        uint index = userReports.length;
        for(uint i=0;i<userReports.length;i++){
            if(keccak256(abi.encodePacked(userReports[i])) == keccak256(abi.encodePacked(reportId))){
                index = i;
                break;
            }
        }
        if(index==userReports.length){
            emit NotSelfResource(msg.sender,reportId);
            return false;
        }
        for(uint i=index+1;i<userReports.length;i++){
            userToReportMapping[msg.sender][i] = userToReportMapping[msg.sender][i-1];
        }
        userToReportMapping[msg.sender].pop();
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
    
    function createReport(string memory problem,string[] memory attachement,string[] memory tags,address owner,uint createdAt) public returns(bool){
        string memory reportId = randomString(15);
        bool verified = false;
        if(userContract.getVerificationStatus(msg.sender, 1)||userContract.getVerificationStatus(msg.sender, 2)){
            verified = true;
        }
        ReportType memory report = ReportType(reportId,owner,new address[](0),attachement,tags,verified,problem,createdAt,0);
        reports[reportId] = report;
        reportKeys.push(reportId);
        userToReportMapping[owner].push(reportId);
        testReports.push(report);
        emit reportCreated(reportId);
        return true;
    }

    // function updateReport(string memory reportId,string[] memory newDiagnosis) public onlyDoctorWithAccess(msg.sender,reportId) returns (bool) {
    //     ReportType memory report = reports[reportId];
    //     report.diagnosis = newDiagnosis;
    //     reports[reportId] = report;
    //     emit reportUpdate(reportId);
    //     return true;
    // }

    function getPatientReports(address patientAddress) public view returns (ReportType[] memory) {
        ReportType[] memory foundReports = new ReportType[](userToReportMapping[patientAddress].length);
        for (uint i = 0; i < userToReportMapping[patientAddress].length; i++) {
            foundReports[i] = reports[userToReportMapping[patientAddress][i]];
        }
        return foundReports;
    }

    function getDoctorReports(address doctorAddress) public view returns (ReportType[] memory){
        string[] memory otherReports = doctorToReportMapping[doctorAddress]; 
        ReportType[] memory r = new ReportType[](otherReports.length);
        for(uint i=0;i<otherReports.length;i++){
            r[i] = reports[otherReports[i]];
        }
        return r;
    }

    function getCurrentPatientDoctorAccessReport(address patientAddress, address doctorAddress) public view returns (ReportType[] memory) {
    string[] storage ReportIds = doctorToReportMapping[doctorAddress];
    string[] memory RelatedReportIds = new string[](ReportIds.length);
    uint count = 0;
    for (uint i = 0; i < ReportIds.length; i++) {
        if (reports[ReportIds[i]].patientAddress == patientAddress) {
            RelatedReportIds[count] = ReportIds[i];
            count++;
        }
    }
    ReportType[] memory trimmedRelatedReportIds = new ReportType[](count);
    for (uint j = 0; j < count; j++) {
        trimmedRelatedReportIds[j] = reports[RelatedReportIds[j]];
    }
    return trimmedRelatedReportIds;
}

    function updateTags(string memory reportId,string[] memory tags) public onlyOwner(msg.sender,reportId) returns(bool) {
        ReportType memory report = reports[reportId];
        if(report.patientAddress != msg.sender) revert("user doesnot owne the resource to signin");
        report.tags = tags;
        reports[reportId] = report;
        emit reportUpdate(reportId);
        return true;
    }

    function addDiagnosis(string memory reportId,string memory text,string memory fname,string memory lname,uint created_at) public returns(bool){
        string memory id = randomString(8);
        Diagnosis memory d = Diagnosis(text,created_at,fname,lname,msg.sender);
        reportToDiagnosis[reportId].push(id);
        reportDiagnosis[id] = d;
        testDiagnosis.push(d);
        return true;
    }

    function getDiagnosis(string memory reportId) public view returns(Diagnosis[] memory){
        Diagnosis[] memory d = new Diagnosis[](reportToDiagnosis[reportId].length);
        for(uint i=0;i<reportToDiagnosis[reportId].length;i++){
            d[i] = reportDiagnosis[reportToDiagnosis[reportId][i]];
        }
        return d;
    }

    function updateDiagnosis(string memory diagnosisId,string memory text,uint date) public returns(bool){
        reportDiagnosis[diagnosisId].text = text;
        reportDiagnosis[diagnosisId].date = date;
    }

    function getMyRequests(address userAddress) public view returns(RequestType[] memory){
        string[] memory userReports = userToReportMapping[userAddress];
        uint size = 0;
        for(uint i=0;i<userReports.length;i++){
            size+= accessRequests[userReports[i]].length;
        }
        RequestType[] memory r = new RequestType[](size);

        for(uint i=0;i<userReports.length;i++){
            for(uint j=0;j<accessRequests[userReports[i]].length;j++){
                uint index = i+j;
                r[index] = accessRequests[userReports[i]][j];
            }
        }
        return r;
    }   

    function getAllRequests() public view returns(RequestType[] memory){

        uint size = 0;
        for(uint i=0;i<reportKeys.length;i++){
            size+= accessRequests[reportKeys[i]].length;
        }

        RequestType[] memory r = new RequestType[](size);

        for(uint i=0;i<reportKeys.length;i++){
            for(uint j=0;j<accessRequests[reportKeys[i]].length;j++){
                uint index = i+j;
                r[index] = accessRequests[reportKeys[i]][j];
            }
        }
        return r;
    }

    function getRequestKeys() private view returns(string[] memory){
        return reportKeys;
    }

    function getCompleteReport(string memory id) public view returns(ReportType memory){
        return reports[id];
    }
}

