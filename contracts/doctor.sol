// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;
contract Doctor{

    struct Date{
        uint date;
        uint month;
        uint year;
    }

    struct DoctorType{
        string fname;
        string lname;
        string designation;
        string[] degree;
        string email;
        string password;
        bool verfiedEmail;
        bool doctorVerfied;
        address walletAddress; 
        Date DoB;
    }

    struct DoctorInfo{
        string fname;
        string lname;
        string designation;
        string[] degree;
        string email;
    }

    mapping(address=>DoctorType) doctors;

    event doctorCreated();
    event doctorUpdated();
    event doctorRemoved();

    function editDoctor() public returns (bool){
    
    }
    
    function deleteDoctor() public returns (bool){

    }

    function createDoctor(string memory fname,string memory lname,string memory email,string memory password,address walletAddress,uint day,uint month,uint year) public view returns(bool) {
        return true;
    }

    function getDoctorInfo(address doctorAddress) public view returns (DoctorInfo memory){
        DoctorType memory completeInfo = doctors[doctorAddress];
        DoctorInfo memory doctorInfo;
        doctorInfo.fname = completeInfo.fname;
        doctorInfo.lname = completeInfo.lname;
        doctorInfo.designation = completeInfo.designation;
        doctorInfo.degree = completeInfo.degree;
        doctorInfo.email = completeInfo.email;
        return doctorInfo;
    }

    function checkIfDoctor(address doctorAddress) public view returns(bool){
        if(doctors[doctorAddress].walletAddress!=address(0)) return true;
        return false;
    }
}