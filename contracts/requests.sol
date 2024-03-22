// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.21;

import './user.sol';

contract Request{

    enum RequestStatusEnumType {approved,rejected,pending}

    enum AccountRequestEnumType {verfifcation,promotion,deletion}
    
    enum ReportRequestEnumType {verification,access,deleteion}

    event accountCreated(string);
    event accountUpdated(string);
    event accountDeleted(string);

    event RequestCreated(string);
    event RequestNotFound(string);
    event RequestNotUpdated(string);
    event RequestFound(string);
    event RequestUpdated(string);
    event RequestDeleted(string);

    User userContract;

    struct AccountRequestType{
        string requestId;
        address updatedBy;
        uint created_at;
        uint updated_at;
        AccountRequestEnumType requestType;
        RequestStatusEnumType requestStatus; 
    }

    constructor(address userContractAddress){
        userContract = User(userContractAddress);
    }


    mapping(address=>string[]) addressToRequests; 
    mapping(string=>AccountRequestType) accountRequests;
    string[] accountRequestKeys; // admin can view all

    function createAccountRequest(
        string memory requestId,
        address senderAddress,
        uint created_at,
        uint updated_at,
        uint requestType
    )public returns(bool) {
        AccountRequestEnumType rt;
        if(requestType==0){
            rt = AccountRequestEnumType.verfifcation;
        }else if(requestType==1){
            rt = AccountRequestEnumType.promotion;
        }else if(requestType==2){
            rt = AccountRequestEnumType.deletion;
        }
        AccountRequestType memory r = AccountRequestType(requestId,senderAddress,created_at,updated_at,rt,RequestStatusEnumType.pending);
        accountRequests[requestId] = r;
        addressToRequests[senderAddress].push(requestId);
        accountRequestKeys.push(requestId);
        return true;
    }

    function EditAccountStatus(string memory requestId,uint status) public returns(bool){
        // string[] memory r = addressToRequests[accountAddress];
        // uint index = r.length;
        // for(uint i=0;i<r.length;i++){
        //     if(keccak256(abi.encodePacked(r[i])) == keccak256(abi.encodePacked(requestId))){
        //         index = i;
        //         break;
        //     }
        // }
        // if(index==r.length){
        //     emit RequestNotFound(requestId);
        //     return false;
        // }
        RequestStatusEnumType rs;

        if(status==0){
            rs = RequestStatusEnumType.approved;
        }else if(status==1){
            rs = RequestStatusEnumType.pending;
        }else if(status==2){
            rs = RequestStatusEnumType.rejected;
        }
        
        if(bytes(accountRequests[requestId].requestId).length>0){
            accountRequests[requestId].requestStatus = rs;
            return true;
        }else return false; 
        // addressToRequests[accountAddress][index].requestStatus = status;
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

    function getMyAccountRequests(address senderAddress) public returns(AccountRequestType[] memory){
        string[] memory reportIds = addressToRequests[senderAddress];
        AccountRequestType[] memory requests =  new AccountRequestType[](reportIds.length);
        for(uint i=0;i<reportIds.length;i++){
            requests[i] = accountRequests[reportIds[i]];
        }
        return requests;
    }

    function checkIfRequest(string memory requestId) public view returns(bool){
        if(bytes(accountRequests[requestId].requestId).length>0){
            return true;
        }
        return false;
    }

    function getAccountRequest(string memory reportId) public view returns(AccountRequestType memory){
        return accountRequests[reportId];
    }
}

