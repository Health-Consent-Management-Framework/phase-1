// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;
import {Admin} from "./admin.sol";
import {PatientRecordSystem} from "./patientCRUD.sol";
import {Doctor} from "./doctor.sol";
import {Worker} from "./worker.sol";

contract User{

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

    Admin adminContract;
    Worker workerContract;
    Doctor doctorContract;
    PatientRecordSystem patientContract;

    uint totalUsers;

    constructor(address patient,address doctor,address admin,address worker){
        totalUsers = 0;        
        patientContract = PatientRecordSystem(patient);
        doctorContract = Doctor(doctor);
        adminContract = Admin(admin);
        workerContract = Worker(worker);
    }

    function signup(
        string memory fname,
        string memory lname,
        string memory username,
        string memory password,
        type_of_user givenType,
        uint16 day,uint16 month,uint256 year
    ) external returns(bool){
        bool success;
        if(givenType==type_of_user.admin){
            success = adminContract.createAdminRequest(fname, lname, username, password, day, month, year);(fname,lname,username,password,msg.sender,day,month,year);
        }else if(givenType==type_of_user.worker){

        }else if(givenType==type_of_user.doctor){
        
        }else if(givenType==type_of_user.patient){
            
        }
        return true;
    }  
}