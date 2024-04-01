// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Notifications{

    event NotificationCreated(string,uint);
    event NotificationNotFound(string);
    event NotificationDeleted(string);

    uint counter = 0;

    struct NotificationType{
        string id;
        uint recievedAt;
        string message;
        address sentBy;
    }

    mapping(address=>string[]) userToNotifications;
    mapping(string=>NotificationType) notifications;

    function createNotification(string memory message,uint recievedAt,address reciever) public returns(bool){
        string memory id = randomString(15);
        NotificationType memory n = NotificationType(id,recievedAt,message,msg.sender);
        userToNotifications[reciever].push(id);
        notifications[id] = n;
        return true;
    }

    function deleteNotification(string memory id) public returns(bool){
        string[] memory userNotifications = userToNotifications[msg.sender];
        uint index = userNotifications.length;

        for(uint i=0;i<userNotifications.length;i++){
            if(keccak256(abi.encodePacked(id)) == keccak256(abi.encodePacked(userNotifications[i]))){
                index = i;
                break;
            }
        }

        if(index==userNotifications.length){
            emit NotificationNotFound(id);
            return false;
        }

        for(uint i=index+1;i<userNotifications.length;i++){
            userToNotifications[msg.sender][i] = userToNotifications[msg.sender][i-1];
        }
        userToNotifications[msg.sender].pop();
        return true;
    }

    function randomString(uint size) public  payable returns(string memory){
        bytes memory randomWord=new bytes(size);
        bytes memory chars = new bytes(26);
        chars="abcdefghijklmnopqrstuvwxyz1234567890";
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
}