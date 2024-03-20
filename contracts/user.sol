// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;
import "./admin.sol";
import "./patient.sol";
import "./doctor.sol";
import "./worker.sol";

contract User{

    enum type_of_user{dummy,admin,worker,doctor,patient}
    enum verificationStatus {notVerfied,verfied,rejected}

    event loginStatus(bool, string);
    event signupStatus(bool, string);

    address patientAddress;
    address adminAddress;
    address workerAddress;
    address doctorAddress;

    string [] superKeys = [
        'key1',
        'key2',
        'key3',
        'key4'
    ];
    
    struct roleEle{
        type_of_user role;
        bool exists;
        verificationStatus isVerfied;
    }

    struct userRoleInfo{
        address id;
        roleEle roleInfo;
    }

    mapping(address=>roleEle) addressToRoles;
    mapping(string=>address) emailToAddress;

    userRoleInfo[] users;


    modifier onlyAdmin(){
        require(addressToRoles[msg.sender].role==type_of_user.admin && addressToRoles[msg.sender].isVerfied==verificationStatus.verfied);
        _;
    }

    modifier onlyWorker(){
        require(addressToRoles[msg.sender].role==type_of_user.worker && addressToRoles[msg.sender].isVerfied==verificationStatus.verfied);
        _;
    }

    event logBytes(bytes32);
    event logAddress(address);
    uint totalUsers;

    constructor(address patient,address doctor,address worker,address admin){
        totalUsers = 0;     
        patientAddress = patient;
        doctorAddress = doctor;
        workerAddress = worker;
        adminAddress = admin;   
    }

    function signup(
        type_of_user role
    ) public returns(bool,string memory){
        if(addressToRoles[msg.sender].role==role){
            if(addressToRoles[msg.sender].isVerfied==verificationStatus.verfied) revert('User alreadt exits and is verfied');
            else{
                emit signupStatus(false,'user exits and is not verfied');
                revert('user exits and is not verfied');
            }
        }else{
            roleEle memory ele;
            if(role==type_of_user.patient){
                ele = roleEle(role,true,verificationStatus.verfied);
                addressToRoles[msg.sender] = ele;            
            }else{
                ele = roleEle(role,true,verificationStatus.notVerfied);
                addressToRoles[msg.sender] = ele;
            }
            userRoleInfo memory userInfo;
            userInfo.id = msg.sender;
            userInfo.roleInfo = ele;
            users.push(userInfo);
            emit signupStatus(true,'user creation successful');
            return (true,'user creation successful');
        }
    }  

    function checkUserRole(type_of_user role,address userAddress) public view returns(bool,bool,string memory){
        if(addressToRoles[msg.sender].role==role){
            if(addressToRoles[msg.sender].isVerfied==verificationStatus.verfied){
                return(true,true,'User login successful');
            }else{
                return(true,false,'Please wait for verification');
            }
        }else{
            return (false,false,'invalid credentials');
        }
    }

    function checkIfUserExists(address userAddress) public view returns(bool,bool,string memory,type_of_user){
        if(addressToRoles[userAddress].exists){
            if(addressToRoles[userAddress].isVerfied==verificationStatus.verfied){
                return(true,true,'User login successful',addressToRoles[userAddress].role);
            }else{
                return(true,false,'Please wait for verification',addressToRoles[userAddress].role);
            }
        }else{
            return (false,false,'invalid credentials',type_of_user.patient);
        }
    }

    function signUpWithKey(string memory key) public returns(bool,string memory){
        bool isKey = false;
        
        for(uint i=0;i<superKeys.length;i++){
            if(keccak256(abi.encodePacked(superKeys[i])) == keccak256(abi.encodePacked(key))){
                isKey = true;
                break;
            }
        }
        
        if(!isKey) return(false,'not a valid key');

        if(
            addressToRoles[msg.sender].role==type_of_user.patient ||
            addressToRoles[msg.sender].role==type_of_user.doctor ||
            addressToRoles[msg.sender].role==type_of_user.worker
        ){
            emit signupStatus(false,'user signed for another role. request for promotion');
            return (false,'user signed for another role. request for promotion');
        }else{
            addressToRoles[msg.sender] = roleEle(type_of_user.admin,true,verificationStatus.verfied);
            emit signupStatus(true,"Admin created and verified successfully");
            return (true,"Admin created and verified successfully");
        }
    }

}