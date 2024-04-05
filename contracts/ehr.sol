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
        string id;
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
    mapping(string => string[]) public reportToRequests;
    mapping(string => RequestType) public accessRequests;
    mapping(string => string[]) reportToDiagnosis; 
    mapping(string => Diagnosis) reportDiagnosis; 
    string[] reportKeys;
    string[] requestKeys;
    Diagnosis[] testDiagnosis;
    RequestType[] testRequests;
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
    event AccessRequestApproved(address doctorAddress, string reportId,string requestId);
    event AccessRequestRejected(address doctorAddress, string reportId,string index);
    event VerificationRequestCreated(address patientAddress,string reportId);
    event VerificationRequestUpdated(address workerAddress,string reportId,RequestStatus r);
    event VerificationRequestDeleted(address workerAddress,string reportId);

    constructor(address _userAddress) {
        userContract = User(_userAddress); 
        totalReports = 0;
    }

    function revokeDoctorAccessToPatient(string memory reportId, address doctorAddress) public returns (bool) {
        ReportType storage report = reports[reportId];
        string[] storage doctorReports = doctorToReportMapping[doctorAddress]; // Use storage instead of memory
        bool success = false;
        for(uint i = 0; i < doctorReports.length; i++) {
        if(keccak256(abi.encodePacked(reportId)) == keccak256(abi.encodePacked(doctorReports[i]))) {
                doctorReports[i] = doctorReports[doctorReports.length - 1];
                doctorReports.pop();
                success = true;
                break;
            }
        }
        for(uint i = 0; i < report.doctorAddress.length; i++) {
            if(report.doctorAddress[i] == doctorAddress) { 
                success = true;
                report.doctorAddress[i] = report.doctorAddress[report.doctorAddress.length - 1];
                report.doctorAddress.pop();
                emit DoctorAccessRevoked(doctorAddress, reportId);
                break; 
            }   
        }
        if(success){
            emit NoAccessToReport(msg.sender, reportId);
        }else emit DoctorAccessRevoked(msg.sender,reportId);
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
        uint index = reportToRequests[reportId].length;
        string memory requestId = randomString(10);
        RequestType memory request = RequestType(requestId,reportId,msg.sender,reciever,createdAt,0,RequestStatus.pending,RequestTypeEnum.access);
        accessRequests[requestId] = request;
        reportToRequests[reportId].push(requestId);
        emit AccessRequestSent(msg.sender, reportId,index);
        return hasAccess;
    }

    function approveAccessRequest(string memory requestId,string memory reportId,uint updatedAt) public returns (bool){
        RequestType storage request = accessRequests[requestId];
        // require(request.status != RequestStatus.pending, "Access request is not pending");
        bool alreadyHasAccess = false;
        for(uint i=0;i<reports[reportId].doctorAddress.length;i++){
            if(request.sentBy==reports[reportId].doctorAddress[i]){
                alreadyHasAccess = true;
                break;
            }
        }
        // if(alreadyHasAccess) revert("user already has access to the report");
        request.status = RequestStatus.approved;
        accessRequests[requestId] = request;
        accessRequests[requestId].updatedAt = updatedAt;
        reports[reportId].doctorAddress.push(request.sentBy);
        doctorToReportMapping[request.sentBy].push(reportId);
        emit AccessRequestApproved(request.sentBy, reportId,requestId);
        return true;
    }

    function rejectAccessRequest(string memory requestId,string memory reportId,uint updatedAt) public returns(bool) {
        RequestType storage request = accessRequests[requestId];
        require(request.status != RequestStatus.pending, "Access request is not pending");
        request.status = RequestStatus.rejected;
        accessRequests[requestId] = request;
        accessRequests[requestId].updatedAt = updatedAt;
        // reports[reportId].doctorAddress.push(request.receivedBy);
        emit AccessRequestRejected(request.receivedBy, reportId,requestId);
        return true;
    }

    function createVerificationRequest(string memory reportId,address senderAddress,uint created_at) public returns(bool){
        string[] memory patientReports = userToReportMapping[senderAddress];
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
            string memory requestId = randomString(10);
            RequestType memory v = RequestType(requestId,reportId,senderAddress,address(0),created_at,0,RequestStatus.pending,RequestTypeEnum.verification);
            accessRequests[requestId] = v;
            reportToRequests[reportId].push(requestId);
            testRequests.push(v);
            emit VerificationRequestCreated(senderAddress,reportId);
            return true;
        }else{
            emit NotSelfResource(senderAddress,reportId);
            return false;
        }
    }

    function approveVerificationRequest(string memory reportId,string memory requestId,uint updated_at) public returns(bool){
        if(userContract.getVerificationStatus(msg.sender, 1)||userContract.getVerificationStatus(msg.sender,2)){
            if(accessRequests[requestId].status == RequestStatus.pending){
                accessRequests[requestId].status = RequestStatus.approved;
                reports[reportId].isVerified = true;
                accessRequests[requestId].receivedBy = msg.sender;
                accessRequests[requestId].updatedAt = updated_at;
           }
        }
    }   

    function rejectVerificationRequset(string memory reportId,string memory requestId,uint updated_at) public returns(bool){
        if(userContract.getVerificationStatus(msg.sender, 1)||userContract.getVerificationStatus(msg.sender,2)){
            if(accessRequests[requestId].status == RequestStatus.pending){
                accessRequests[requestId].status = RequestStatus.rejected;
                accessRequests[requestId].updatedAt = updated_at;
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
        bytes memory chars = new bytes(26);
        chars="abcdefghijklmnopqrstuvwxyz";
        for (uint i=0;i<size;i++){
            uint randomNumber=random(26);
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

    function getReportsWithoutAccess(address patientAddress, address doctorAddress) public view returns (ReportType[] memory){
        string[] storage PatientReportIds = userToReportMapping[patientAddress];
        string[] memory unrelatedReportIds = new string[](PatientReportIds.length);
        ReportType[] memory reportsWithAccess = getCurrentPatientDoctorAccessReport(patientAddress, doctorAddress);
        uint count = 0;
        for(uint i=0;i<PatientReportIds.length;i++){
        bool available = false;
            for(uint j=0;j<reportsWithAccess.length;j++){
                if (keccak256(abi.encodePacked(PatientReportIds[i])) == keccak256(abi.encodePacked(reportsWithAccess[j].reportId))) {
                    available = true;
                    break;
                }
            }
            if(!available){
                unrelatedReportIds[count] = PatientReportIds[i];
                count++;
            }
        }
        ReportType[] memory reportsWithoutAccess = new ReportType[](count);
        for (uint j = 0; j < count; j++) {
            reportsWithoutAccess[j] = reports[unrelatedReportIds[j]];
        }
        return reportsWithoutAccess;
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

    function getMyRequests(address userAddress,RequestTypeEnum requestType) public view returns(RequestType[] memory){
        string[] memory userReports = userToReportMapping[userAddress];
        uint size = 0;
        for(uint i=0;i<userReports.length;i++){
            size += reportToRequests[userReports[i]].length;
        }
        RequestType[] memory r = new RequestType[](size);

        for(uint i=0;i<userReports.length;i++){
            for(uint j=0;j<reportToRequests[userReports[i]].length;j++){
                uint index = i+j;
                string memory reportId = userReports[i];
                string memory requestId = reportToRequests[reportId][j];
                r[index] = accessRequests[requestId];
            }
        }
        return r;
    }   

    function getAllRequests() public view returns(RequestType[] memory){

        uint size = 0;
        for(uint i=0;i<reportKeys.length;i++){
            size+= reportToRequests[reportKeys[i]].length;
        }

        RequestType[] memory r = new RequestType[](size);

        for(uint i=0;i<reportKeys.length;i++){
            for(uint j=0;j<reportToRequests[reportKeys[i]].length;j++){
                uint index = i+j;
                string memory reportId = reportKeys[i];
                string memory requestId = reportToRequests[reportId][j];
                r[index] = accessRequests[requestId];
            }
        }
        return r;
    }

    function getReport(string memory reportId) public view returns(ReportType memory){
        return reports[reportId];
    }

}