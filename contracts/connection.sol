// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;

contract Connection{
    mapping(address=>address[]) connections;

    function createConnection(address to,address from) public returns(bool){
        bool exists = false;
        address[] memory userConnections = connections[to];
        for(uint i=0;i<userConnections.length;i++){
            if(userConnections[i]==to||userConnections[i]==from){
                exists = true;
                break;
            }
        }
        if(exists) return false;
        connections[to].push(from);
        connections[from].push(to);
        return true; 
    }

    function deleteConnection(address from) public returns(bool){
        address[] memory senderConnections = connections[msg.sender];
        address[] memory recieverConnections = connections[from];
        uint connectionIndex = senderConnections.length;

        for(uint i=0;i<senderConnections.length;i++){
            if(senderConnections[i] == from){ 
                connectionIndex = i;
                break;    
            }
        }
        if(connectionIndex == senderConnections.length) return false;
        for(uint i=connectionIndex+1;i<senderConnections.length;i++){
            connections[msg.sender][i-1] = connections[msg.sender][i];
        }
        connections[msg.sender].pop();
        connectionIndex = recieverConnections.length;
        for(uint i=0;i<recieverConnections.length;i++){
            if(recieverConnections[i] == msg.sender){ 
                connectionIndex = i;
                break;    
            }
        }
        if(connectionIndex == recieverConnections.length) return false;
        for(uint i=connectionIndex+1;i<recieverConnections.length;i++){
            connections[from][i-1] = connections[from][i];
        }
        connections[from].pop();
        return true;
    }

    function getConnections(address walletAddress) public view returns(address[] memory){
        return connections[walletAddress];
    }
}