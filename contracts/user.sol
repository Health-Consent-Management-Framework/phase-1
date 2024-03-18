// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;
import "./admin.sol";
import "./patient.sol";
import "./doctor.sol";
import "./worker.sol";

contract User{

    enum type_of_user{admin,worker,doctor,patient}
    mapping(address=>string) userToEmail; // to ensure one email has one address
    mapping(string=>address) emailToUser; // to ensure emails are unique

    mapping(address => userToken) private userTokens;

    enum verficationStatus {notVerfied,verfied,rejected}


    modifier authorize(){
        require(userTokens[msg.sender].exists,"user not authorized");
        require(userTokens[msg.sender].time == 0 ,"session expired!");
        _;
    }

    modifier onlyAdmin(){
        require(adminContract.checkIfAdmin(msg.sender),"only admin can access the feature");
        _;
    }

    modifier onlyWorker(){
        require(workerContract.checkIfWorker(msg.sender),"only worker can access the feature");
        _;
    }

    struct userToken{
        bool exists;
        uint time;
        string email;
        bytes32 token;
    }

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
        require(emailToUser[email] == address(0),"User with given mail already exists");
        require(bytes(userToEmail[msg.sender]).length<=0,"user with given wallet already exist");

        if(givenType==type_of_user.admin){
            success = adminContract.createAdminRequest(fname,lname,email,password,msg.sender,day,month,year);
        }else if(givenType==type_of_user.worker){
            success = workerContract.createWorkerRequest(fname,lname,email,password,msg.sender,day,month,year);
        }else if(givenType==type_of_user.doctor){
            success = doctorContract.createDoctor(fname,lname,email,password,msg.sender,day,month,year);
        }else if(givenType==type_of_user.patient){    
            success = patientContract.createPatient(fname,lname,email,password,day,month,year,"location-1",msg.sender);     
        }
        if(!success){
            revert("failed to create user");
        }
        emailToUser[email] = msg.sender;
        userToEmail[msg.sender] = email;
        return success;
    }  

    function setUpPassword(string memory password,string memory email,type_of_user givenType) public pure returns (bool){
        bytes32 salt = bytes32(abi.encodePacked(email));
        bytes32 hashedPassword = keccak256(abi.encodePacked(password, salt));
        return true;
    }

    function hashPassword(string memory password, bytes32 salt) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(password, salt));
    }

    function login(string memory username,string memory password,address walletAddress,type_of_user givenType) public returns(bool,string memory){
        bool exists = false; 
        string memory isVerifed = 'verified';
        if(keccak256(abi.encodePacked(userToEmail[msg.sender]))!=keccak256(abi.encodePacked(username)))
            return (false,"invalid credential");
        if(givenType==type_of_user.admin){
            exists = adminContract.login(username,password,walletAddress);
        }
        else if (givenType==type_of_user.worker){
            (exists,isVerifed) = workerContract.login(username,password,walletAddress);
        }
        else if(givenType==type_of_user.doctor){
            (exists,isVerifed) = doctorContract.login(username,password,walletAddress);
        }
        else if(givenType==type_of_user.patient)
            exists = patientContract.login(username,password,walletAddress);
        if(!exists) revert("Please check the given credentials");
        return (exists,isVerifed);
    }

    function forgotPassword(string memory email,address accountAddress) public returns (bool){

    }

    function checkAddressByEmail(string memory email) public view returns(bool) {
        if(emailToUser[email]!=address(0)) return true;
        return false;
    }

    function changeEmail(string memory newEmail,string memory oldEmail,string memory password) public returns(bool){
        if(keccak256(abi.encodePacked(oldEmail)) != keccak256(abi.encodePacked(userToEmail[msg.sender]))) revert("oldEmail doesn't match");
        if(msg.sender!=emailToUser[oldEmail]) revert("something went wrong");
        userToEmail[msg.sender] = newEmail;
        delete emailToUser[oldEmail];
        emailToUser[newEmail] =msg.sender;
        return true;
    }

}