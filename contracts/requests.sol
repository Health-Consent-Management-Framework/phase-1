// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.21;

import './user.sol';
import './admin.sol';
import './patient.sol';
import './doctor.sol';
import './worker.sol';


contract Request{

    uint counter = 0;

    enum RequestStatusEnumType {pending,approved,rejected}

    enum AccountRequestEnumType {verfifcation,promotion,deletion,connect}
    
    enum ReportRequestEnumType {verification,access,deleteion}

    event accountCreated(string);
    event accountUpdated(string);
    event accountDeleted(string);
    event accountActivated(address);

    event userDoesNotExist(address);

    event RequestCreated(string);
    event RequestNotFound(string);
    event RequestNotUpdated(string);
    event RequestFound(string);
    event RequestUpdated(string);
    event RequestDeleted(string);

    User userContract;
    Admin adminContract;
    Worker workerContract;
    Doctor doctorContract;
    Patient patientContract;


    struct AccountRequestType{
        string requestId;
        address sentBy;
        address updatedBy;
        string message;
        uint createdAt;
        uint updatedAt;
        AccountRequestEnumType requestType;
        RequestStatusEnumType requestStatus; 
    }

    struct ReportRequestType {
        string id;
        string reportId;
        address sentBy;
        address receivedBy;
        uint createdAt;
        uint updatedAt;
        RequestStatusEnumType status;
        ReportRequestEnumType requestType;
    }

    constructor(
        address userContractAddress,
        address adminContractAddress,
        address workerContractAddress,
        address doctorContractAddress,
        address patientContractAddress
    ){
        userContract = User(userContractAddress);
        adminContract = Admin(adminContractAddress);
        workerContract = Worker(workerContractAddress);
        doctorContract = Doctor(doctorContractAddress);
        patientContract = Patient(patientContractAddress);
    }

    function randomString(uint size) public  payable returns(string memory){
        bytes memory randomWord=new bytes(size);
        // since we have 26 letters
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

    mapping(address=>string[]) addressToRequests; 
    mapping(string=>AccountRequestType) accountRequests;

    string[] accountRequestKeys; // admin can view all

    // ---------------------------   Account Request ---------------------------------------- //

    function createAccountRequest(
        address senderAddress,
        string memory message,
        address recieverAddress,
        uint createdAt,
        uint updatedAt,
        uint requestType
    )public returns(bool,string memory) {
        AccountRequestEnumType rt;
        if(requestType==0){
            rt = AccountRequestEnumType.verfifcation;
        }else if(requestType==1){
            rt = AccountRequestEnumType.promotion;
        }else if(requestType==2){
            rt = AccountRequestEnumType.deletion;
        }else if(requestType==3){
            rt = AccountRequestEnumType.connect;
        }
        string memory requestId = randomString(10);
        AccountRequestType memory r = AccountRequestType(requestId,senderAddress,recieverAddress,message,createdAt,updatedAt,rt,RequestStatusEnumType.pending);
        accountRequests[requestId] = r;
        addressToRequests[senderAddress].push(requestId);
        if(requestType!=3){
            // prevents adming from getting the connection requests;
            accountRequestKeys.push(requestId);
        }else{
            //updating it in the reciever side so as to see request on his screen
            addressToRequests[recieverAddress].push(requestId);
        }
        return (true,requestId);
    }

    function EditAccountRequestStatus(string memory requestId,uint status,uint updatedAt) public returns(bool){
        RequestStatusEnumType rs;
        // normal request rejection
        if(status==0){
            rs = RequestStatusEnumType.pending;
        }else if(status==1){
            rs = RequestStatusEnumType.approved;
        }else if(status==2){
            rs = RequestStatusEnumType.rejected;
        }

        if(bytes(accountRequests[requestId].requestId).length>0){
            accountRequests[requestId].requestStatus = rs;
            accountRequests[requestId].updatedAt = updatedAt;
            accountRequests[requestId].updatedBy = msg.sender;
            return true;
        }else return false; 
    }

    function ApproveAccountRequest(string memory requestId) public returns (bool){
        address toBeVerifed = accountRequests[requestId].sentBy;
        uint verifierRole = userContract.getUserRole(msg.sender);
        uint toBeVerifedRole = userContract.getUserRole(toBeVerifed);
        bool success;
        bool vv = userContract.getVerificationStatus(msg.sender, verifierRole);
        if(vv){
            if(accountRequests[requestId].requestType == AccountRequestEnumType.verfifcation){
                if(verifierRole==1){
                    userContract.changeVerificationStatus(toBeVerifed, 1);
                    if(toBeVerifedRole==4){
                    success = patientContract.verifyUser(toBeVerifed,true);
                    }else if(toBeVerifedRole==3){
                    success = doctorContract.verifyUser(toBeVerifed,true);
                    }else if(toBeVerifedRole==2){
                    success = workerContract.verifyUser(toBeVerifed,true);
                    }else if(toBeVerifedRole==1){
                    success = adminContract.verifyUser(toBeVerifed,true);
                    }
                }else if(verifierRole==2){
                    if(toBeVerifedRole==3||toBeVerifedRole==3){
                        userContract.changeVerificationStatus(toBeVerifed, 1);
                        if(toBeVerifedRole==4){
                            success = patientContract.verifyUser(toBeVerifed,true);
                        }else if(toBeVerifedRole==3){
                            success = doctorContract.verifyUser(toBeVerifed,true);
                        }              
                    }
                }
            }else{
                // for connection request
                if(accountRequests[requestId].updatedBy == msg.sender){
                    accountRequests[requestId].requestStatus = RequestStatusEnumType.approved;
                }
            }
        }
        if(success){
            accountRequests[requestId].requestStatus = RequestStatusEnumType.approved;
            emit accountActivated(toBeVerifed);
        }
        return success;
    }

    function deleteAccountRequest(string memory requestId,address senderAddress) public returns (bool) {
        string[] memory r = addressToRequests[senderAddress];
        uint index = r.length;
        for(uint i=0;i<r.length;i++){
            if(keccak256(abi.encodePacked(r[i])) == keccak256(abi.encodePacked(requestId))){
                index = i;
                break;
            }
        }
        if(index==r.length){
            emit RequestNotFound(requestId);
            return false;
        }
        for (uint i = index; i < addressToRequests[senderAddress].length - 1; i++) {
            addressToRequests[senderAddress][i] = addressToRequests[senderAddress][i + 1];
        }
        addressToRequests[senderAddress].pop();
        delete accountRequests[requestId];
        emit RequestDeleted(requestId);
        return true;
    }

    function getMyAccountRequests(address senderAddress) public view returns(AccountRequestType[] memory){
        string[] memory reportIds = addressToRequests[senderAddress];
        AccountRequestType[] memory requests =  new AccountRequestType[](reportIds.length);
        for(uint i=0;i<reportIds.length;i++){
            requests[i] = accountRequests[reportIds[i]];
        }
        return requests;
    }

    function getOtherAccountRequests() public view returns(AccountRequestType[] memory){
        AccountRequestType[] memory requests = new AccountRequestType[](accountRequestKeys.length);
        for(uint i=0;i<accountRequestKeys.length;i++){
            requests[i] = accountRequests[accountRequestKeys[i]];
        }
        return requests;
    }

    function checkIfRequest(string memory requestId) public view returns(bool){
        if(bytes(accountRequests[requestId].requestId).length>0){
            return true;
        }
        return false;
    }

}

