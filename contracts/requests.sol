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
    event RequestFound(string);
    event RequestUpdated(string);
    event RequestDeleted(string);


    struct AccountRequestType{
        string requestId;
        address updatedBy;
        uint created_at;
        uint updated_at;
        AccountRequestEnumType requestType;
        RequestStatusEnumType requestStatus; 
    }

    // struct reportRequest{
    //     string requestId;
    //     string reportId;
    //     uint created_at;
    //     uint updated_at;
    //     address sender;   // sender will always be patient or doctor 
    //     address reciever; // reciever will be changed to updated by in ui
    //     ReportRequestEnumType requestType;
    //     RequestStatusEnumType requestStatus; 
    // }

    mapping(address=>AccountRequestType[]) accountRequests; 
    string[] accountRequestKeys;

    function createAccountRequest(
        string memory requestId,
        address senderAddress,
        uint created_at,
        uint updated_at,
        AccountRequestEnumType requestType
    )public returns(bool) {
        AccountRequestType memory r = AccountRequestType(requestId,senderAddress,created_at,updated_at,requestType,RequestStatusEnumType.pending);
        accountRequests[senderAddress].push(r);
        accountRequestKeys.push(requestId);
        return true;
    }

    function EditAccountStatus(string memory requestId,address accountAddress,RequestStatusEnumType status) public returns(bool){
        AccountRequestType[] memory r = accountRequests[accountAddress];
        uint index = r.length;
        for(uint i=0;i<r.length;i++){
            if(keccak256(abi.encodePacked(r[i].requestId)) == keccak256(abi.encodePacked(requestId))){
                index = i;
                break;
            }
        }
        if(index==r.length){
            emit RequestNotFound(requestId);
            return false;
        }
        accountRequests[accountAddress][index].requestStatus = status;
        return true;
    }

    function deleteAccountRequest(string memory requestId,address senderAddress) public returns (bool) {
        AccountRequestType[] memory r = accountRequests[senderAddress];
        uint index = r.length;
        for(uint i=0;i<r.length;i++){
            if(keccak256(abi.encodePacked(r[i].requestId)) == keccak256(abi.encodePacked(requestId))){
                index = i;
                break;
            }
        }
        if(index==r.length){
            emit RequestNotFound(requestId);
            return false;
        }
        for (uint i = index; i < accountRequests[senderAddress].length - 1; i++) {
            accountRequests[senderAddress][i] = accountRequests[senderAddress][i + 1];
        }
        accountRequests[senderAddress].pop();
        emit RequestDeleted(requestId);
        return true;
    }

    function getMyAccountRequests(address senderAddress)public returns(AccountRequestType[] memory){
        return accountRequests[senderAddress];
    }
}

