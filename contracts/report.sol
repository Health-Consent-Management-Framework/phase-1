// SPDX-License-Identifier: MIT 
//ehr contract
pragma solidity 0.8.21;

contract Report {
    struct MedicalReport {
        uint256 userId;
        uint256 doctorId;
        string reportData; 
    }

    mapping(uint256 => MedicalReport) public reports;

    // Function to create a medical report
    function createReport(uint256 _userId, uint256 _doctorId, string memory _reportData) external {
        require(reports[_userId].userId == 0, "Report already exists for this user.");

        MedicalReport memory newReport = MedicalReport({
            userId: _userId,
            doctorId: _doctorId,
            reportData: _reportData
        });

        // Store the report in the mapping
        reports[_userId] = newReport;
    }

    // Function to get the doctor ID from a specific medical report
    function getDoctorId(uint256 _userId) external view returns (uint256) {
        return reports[_userId].doctorId;
    }

    // Function to get the report data from a specific medical report
    function getReportData(uint256 _userId) external view returns (string memory) {
        return reports[_userId].reportData;
    }
}
