// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;
import "./admin.sol";
import "./patient.sol";
import "./doctor.sol";
import "./worker.sol";

contract User{

    enum type_of_user{admin,worker,doctor,patient}

    event log(string data);

    receive() external payable {}

    struct Date{
        uint date;
        uint month;
        uint year;
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
    Patient patientContract;

    address adminAddress;

    uint totalUsers;

    constructor(address patient,address doctor,address worker,address admin){
        totalUsers = 0;        
        adminAddress = admin;
        patientContract = Patient(patient);
        doctorContract = Doctor(doctor);
        adminContract = Admin(admin);
        workerContract = Worker (worker);
    }

    function signup(
        string memory fname,
        string memory lname,
        string memory email,
        string memory password,
        type_of_user givenType,
        uint day,uint month,uint year
    ) public returns(bool){
        bool success;
        emit log("entered function");
        if(givenType==type_of_user.admin){
            success = adminContract.createAdminRequest(fname,lname,email,password,msg.sender,day,month,year);
        }else if(givenType==type_of_user.worker){
            success = adminContract.createAdminRequest(fname,lname,email,password,msg.sender,day,month,year);
        }else if(givenType==type_of_user.doctor){
        
        }else if(givenType==type_of_user.patient){
            
        }
        emit log("exited function");
        return true;
    }  

    function setUpPassword(string memory password,string memory email,type_of_user givenType) public pure returns (bool){
        bytes32 salt = bytes32(abi.encodePacked(email));
        bytes32 hashedPassword = keccak256(abi.encodePacked(password, salt));
        return true;
    }

    function hashPassword(string memory password, bytes32 salt) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(password, salt));
    }

    function login(string memory username,string memory password,address walletAddress,type_of_user givenType) public view returns(bool){
        if(givenType==type_of_user.admin){
            bool exists = adminContract.login(username,password,walletAddress);
            return exists;
        }
        else if (givenType==type_of_user.worker){}
        else if(givenType==type_of_user.doctor){}
        else if(givenType==type_of_user.patient){}
        return false;
    }
}