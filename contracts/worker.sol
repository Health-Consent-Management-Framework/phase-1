// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.21;

contract Worker{

    enum type_of_user{admin,worker,doctor,patient}

    struct Date{
        uint16 date;
        uint16 month;
        uint256 year;
    }

    struct Location{
        string street;
        string district;
        string state;
    }

    struct UserType{
        string fname;
        string lname;
        string username;
        string password;
        address walletAddress; 
        Date DoB;
    }

    mapping(uint=>address) public workersKeys;
    mapping (address=>UserType) workerData;
    uint totalWorkers;

    constructor(){
        totalWorkers = 0;
    }

    function createWorker(
        address workerAddress,
        string memory fname,
        string memory lname,
        string memory username,
        string memory password,
        uint16 day,uint16 month,uint256 year
        ) public returns (bool){
        Date memory date = Date(day,month,year); 
        UserType memory user = UserType(fname,lname,username,password,workerAddress,date); 
        workersKeys[totalWorkers] = workerAddress;
        workerData[workersKeys[totalWorkers]] = user;
        totalWorkers+=1;
        return true;
    }
    function removeWorker() public view returns (bool){
        return true;
    }
    function updateWorker() public view returns (bool){
        return true;
    }
}