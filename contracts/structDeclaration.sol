enum RequestStatusType {pending,approved,rejected}
enum verificationStatus {notVerfied,verfied,rejected}
enum type_of_user{dummy,admin,worker,doctor,patient}

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

struct roleEle{
    type_of_user role;
    bool exists;
    verificationStatus isVerified;
}

struct userRoleInfo{
    address id;
    roleEle roleInfo;
}

struct AdminType{
    string fname;
    string lname;
    string email;
    string mobileNo;
    string gender;
    bool isVerified;        
    uint height;
    uint weight;
    address walletAddress; 
    uint DoB;
}


struct DoctorType{
    string fname;
    string lname;
    string designation;
    string[] degree;
    string email;
    string mobileNo;
    bool doctorVerified;
    address walletAddress; 
    uint DoB;
    address[] patients; 
}

struct DoctorInfo{
    string fname;
    string lname;
    string designation;
    string[] degree;
    string email;
}

enum RequestStatus { pending, approved, rejected }
enum UploadStatus { pending, uploaded, rejected }


struct AccessRequest {
    uint id;
    string reportId;
    address sentBy;
    address receivedBy;
    uint createdAt;
    uint updatedAt;
    RequestStatus status;
}

struct verficationRequestType {
    string reportId;
    address patientAddress;
    address verfiedBy;
    uint createdAt;
    uint updatedAt;
    RequestStatus status;
}

// struct CompleteReportInfo{
//     AccessRequest[] requests;
//     PatientType patientDetais;
//     DoctorType doctorDetails;
//     ReportType reportinfo;
// }

struct ReportType{
    string reportId;
    address patientAddress;
    address[] doctorAddress;
    string[] attachements;
    string[] diagnosis;
    string[] tags;
    bool isVerified;
    string problem;
}

struct UserType {
    string fname;
    string lname;
    string email;
    string location;
    string gender;
    bool isVerified;
    uint height;
    uint weight;
    uint DoB;
    string mobileNo;
    address walletAddress;
}

struct PatientDeleteRequest{
    uint requestedTimestamp;
    uint modifiedTimestamp;
    RequestStatusType requestStatus;
    address patientAddress;
    string reason;
}

struct WorkerType{
    string fname;
    string lname;
    string email;
    string mobileNo;
    string gender;
    bool isVerified;
    uint height;
    uint weight;
    address walletAddress; 
    uint DoB;
}

struct workerRequestType{
    address walletAddress;
    string email;
    verificationStatus isVerfied;
    string requestType;
    uint created_at;
}

struct AdminRequest{
    address walletAddress;
    string email;
    uint created_at;
    RequestStatusType requestStatus; 
}