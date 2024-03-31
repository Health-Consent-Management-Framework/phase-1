// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.21;


contract User{

    enum type_of_user{dummy,admin,worker,doctor,patient}
    enum verificationStatus {notVerfied,verfied,rejected}

    event loginStatus(bool, string);
    event signupStatus(bool, string);
    event NotValidKey();
    event KeyFound();
    event isVerfied();
    event isNotVerfied();
    event invalidRole();
    event UserCreated();
    event UserRoleChanged(string);
    event UserCreationFailed();
    event UserNotFound(address);

    string [] superKeys = [
        'key1',
        'key2',
        'key3',
        'key4'
    ];
    
    struct roleEle{
        type_of_user role;
        bool exists;
        verificationStatus isVerified;
    }

    mapping(address=>roleEle) addressToRoles;
    mapping(string=>address) emailToAddress;

    mapping(string=>address) usernameToAddress;
    mapping(address=>string) addressToUsername;
 

    modifier onlyAdmin(){
        require(addressToRoles[msg.sender].role==type_of_user.admin && addressToRoles[msg.sender].isVerified==verificationStatus.verfied);
        _;
    }

    modifier onlyWorker(){
        require(addressToRoles[msg.sender].role==type_of_user.worker && addressToRoles[msg.sender].isVerified==verificationStatus.verfied);
        _;
    }

    // modifier onlyOwner(){}

    uint totalUsers;

    constructor(){
        totalUsers = 0;   
    }

    function signup(
        type_of_user role
    ) public returns(bool,string memory){
        if(addressToRoles[msg.sender].exists){
            if(addressToRoles[msg.sender].isVerified==verificationStatus.verfied) revert('User alreadt exits and is verfied');
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
            // userRoleInfo memory userInfo;
            // userInfo.id = msg.sender;
            // userInfo.roleInfo = ele;
            // users.push(userInfo);
            emit UserCreated();
            emit signupStatus(true,'user creation successful');
            return (true,'user creation successful');
        }
    }  

    function checkUserRole(type_of_user role,address userAddress) public view returns(bool,bool,string memory){
        if(addressToRoles[userAddress].role==role){
            if(addressToRoles[userAddress].isVerified==verificationStatus.verfied){
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
            if(addressToRoles[userAddress].isVerified==verificationStatus.verfied){
                // exists , verfied , message , role
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
        
        if(!isKey){
            emit NotValidKey();
            emit UserCreationFailed();
            return(false,'not a valid key');
        }else{
            emit KeyFound();
        }

        if(
            addressToRoles[msg.sender].role==type_of_user.patient ||
            addressToRoles[msg.sender].role==type_of_user.doctor ||
            addressToRoles[msg.sender].role==type_of_user.worker
        ){
            // emit signupStatus(false,'user signed for another role. request for promotion');
            emit UserCreationFailed();
            return (false,'user signed for another role. request for promotion');
        }else{
            addressToRoles[msg.sender] = roleEle(type_of_user.admin,true,verificationStatus.verfied);
            emit UserCreated();
            emit signupStatus(true,"Admin created and verified successfully");
            return (true,"Admin created and verified successfully");
        }
    }

    function getVerificationStatus(address userAddress,uint role) public view returns(bool){
        if(addressToRoles[userAddress].exists){
            if(
                role==1&&addressToRoles[userAddress].role==type_of_user.admin ||
                role==2&&addressToRoles[userAddress].role==type_of_user.worker ||
                role==3&&addressToRoles[userAddress].role==type_of_user.doctor ||
                role==4&&addressToRoles[userAddress].role==type_of_user.patient
            ){
                if(addressToRoles[userAddress].isVerified==verificationStatus.verfied){
                    return true;
                } else return false;
            }else return false;
        }else return false;
    }

    function changeUserRole(uint role) public returns(bool,string memory){
        bool exists = addressToRoles[msg.sender].exists;
        if(!exists){
            emit UserNotFound(msg.sender);
            return (false,"user not found");
        }
        type_of_user newRole = type_of_user.dummy;
        if(role == 1) newRole = type_of_user.admin;
        else if(role == 2) newRole = type_of_user.worker;
        else if(role == 3) newRole = type_of_user.doctor;
        else if(role == 4) newRole = type_of_user.patient;
        else{
            emit invalidRole();
            return (false,"Invalid role");
        }
        addressToRoles[msg.sender].role = newRole;
        if(role!=4) addressToRoles[msg.sender].isVerified  = verificationStatus.verfied;
        return (true,"user role changed");
    }

    function changeVerificationStatus(address userAddress,uint status) public returns(bool){
        if(status==0){
            addressToRoles[userAddress].isVerified = verificationStatus.notVerfied;
        }else if(status==1){
            addressToRoles[userAddress].isVerified = verificationStatus.verfied;
        }else if(status==2){
            addressToRoles[userAddress].isVerified = verificationStatus.rejected;
        }
        return true;
    }

    function getUserRole(address userAddress) public view returns(uint){
        uint r = 0;
        type_of_user role = addressToRoles[userAddress].role;
        if(role==type_of_user.dummy) r = 0;
        else if(role==type_of_user.admin) r = 1;
        else if(role==type_of_user.worker) r = 2;
        else if(role==type_of_user.doctor) r = 3;
        else if(role==type_of_user.patient) r = 4;
        return r;
    }

    function deleteAccount(address userAddress) public returns(bool){
        if(addressToRoles[userAddress].exists){
            delete addressToRoles[userAddress];
            return true;
        }
        else{
            emit UserNotFound(userAddress);
            return false;
        }
    }

}