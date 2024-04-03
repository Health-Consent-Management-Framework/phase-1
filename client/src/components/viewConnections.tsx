import { DialogContent, IconButton, Menu, MenuItem } from "@mui/material";
import { useCallback } from "react";
import avatar from "../assets/avatar.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  abi as ConnectionAbi,
  networks as ConnectionNetworks,
} from "../contracts/Connection.json";
import { MoreVert } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { routeConfig } from "../router";
import useContract from "../hooks/useContract";
import { useCombinedContext } from "../store";
import {
  abi as UserAbi,
  networks as UserNetworks,
} from "../contracts/User.json";
import {
  abi as DoctorsAbi,
  networks as DoctorsNetworks,
} from "../contracts/Doctor.json";
import {
  abi as PatientAbi,
  networks as PatientNetworks,
} from "../contracts/Patient.json";
import {
  abi as ReportAbi,
  networks as ReportNetworks,
} from "../contracts/Report.json";
import { useCalendarState } from "@mui/x-date-pickers/internals";
import ViewAccessReports from "./accessListReport"
import DoctorViewAccessReports from "./doctorAccessList";

interface cardProps {
  fname: string;
  lname: string;
  email: string;
  designation: string;
  updateMenu: (ele: HTMLElement, id: string) => void;
  id: string;
}

const ConnectionCard: React.FC<cardProps> = ({
  fname,
  lname,
  email,
  designation,
  updateMenu,
  id,
}) => {
  return (
    <article className="w-48 flex relative py-3 pt-8 flex-col items-center h-48 border-2 shadow-md rounded-md">
      <img className="w-16 h-16" src={avatar} />
      <span className="pt-2 font-medium">
        {fname} {lname}
      </span>
      <span className="font-medium text-blue-600 pt-3">{designation}</span>
      <span className="absolute top-2 right-2">
        <IconButton onClick={(e) => updateMenu(e.currentTarget, id)}>
          <MoreVert />
        </IconButton>
      </span>
    </article>
  );
};

const ViewConnections: React.FC = () => {
  const { selectedWallet } = useCombinedContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const contract = useContract(ConnectionAbi, ConnectionNetworks);
  const UserContract = useContract(UserAbi, UserNetworks);
  const reportContract = useContract(ReportAbi, ReportNetworks);
  const patientContract = useContract(PatientAbi, PatientNetworks);
  const doctorContract = useContract(DoctorsAbi, DoctorsNetworks);
  const [params, setParams] = useSearchParams();
  const [accessPopup, setAccessPopup] = useState(false);
  const [accessDoctorPopup, setDoctorAccessPopup] = useState(false);
  const [id, setId] = useState('');
  const navigate = useNavigate();
  const [doctorAddresses, setDoctorAddresses] = useState<string[]>([]);
  const [patientAddresses, setPatientAddresses] = useState<string[]>([]);
  // const [patientsData, setpatientsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [role,setRole] = useState('');

  function handleMenuClose() {
    setAnchorEl(null);
    setId('');
  }

  function updateMenu(ele, id) {
    setAnchorEl(ele);
    setId(id);
    console.log(id);
  }

  async function removeConnection(){
    // const createdAt = new Date().getTime()
    // const data = await requestContract?.methods.createAccountRequest(selectedWallet,`${selectedWallet} request for its account to be verified`,doctorId,createdAt,0,requestTypeEnum.connection).send({from:selectedWallet});
    const data1 = await contract?.methods.deleteConnection(id[0]).send({from:selectedWallet});
    // id is giving array
  }

  // async function getReports(){
  //   const data = await reportContract?.methods.getCurrentPatientDoctorAccessReport(selectedWallet,id[0]).send({from:selectedWallet});
  //   console.log(data);
  // }

  async function getConnection() {
    const data = await contract?.methods
      .getConnections(selectedWallet)
      .call({ from: selectedWallet });
    console.log(data);
    if (data) {
      const doctorPromises = data.map(async (address: string) => {
        const role = await UserContract?.methods
          .getUserRole(address)
          .call({ from: selectedWallet });
        return { address, role };
      });

      const roles = await Promise.all(doctorPromises);

      roles.forEach(({ address, role }) => {
        if (role == 3) {
          console.log(1);
          setDoctorAddresses((prev) => [...prev, address]);
        } else if (role == 4) {
          setPatientAddresses((prev) => [...prev, address]);
        }
      });
    }
  }

  const fetchDoctorsData = useCallback(async () => {
    const doctorsData = await Promise.all(
      doctorAddresses.map(async (doctorAddress) => {
        const doctorData = await doctorContract.methods
          .getDoctorInfo(doctorAddress)
          .call({ from: selectedWallet });
        return {...doctorData,walletAddress:doctorAddresses};
      })
    );
    console.log(doctorsData);
    setDoctorsData(doctorsData);
  }, [doctorAddresses, doctorContract, selectedWallet]);

  useEffect(() => {
    fetchDoctorsData();
  }, [doctorAddresses]);

  const fetchPatientsData = useCallback(async () => {
    const patientsData = await Promise.all(
      patientAddresses.map(async (patientAddress) => {
        const patientData = await patientContract.methods
          .getPatient(patientAddress)
          .call({ from: selectedWallet });
        return patientData;
      })
    );
    setPatientsData(patientsData);
  }, [patientAddresses, patientContract, selectedWallet]);

  useEffect(() => {
    fetchPatientsData();
  }, [patientAddresses]);

  useEffect(() => {
    if (contract) {
      getConnection();
    }
  }, [contract]);

  return (
    <section className="h-screen flex flex-col">
      <article className="w-full px-10 py-3 border-b-2">
        <h1 className="text-2xl font-medium">Connections</h1>
      </article>
      <div className="p-8 flex gap-5">
        {doctorsData.map((doctor) => (        
          <ConnectionCard
            key={1}
            updateMenu={updateMenu}
            id={doctor.walletAddress}
            fname={doctor.fname}
            lname={doctor.lname}
            email={doctor.email}
            designation={doctor.designation}
          />
        ))}
        {patientsData.map((patient) => (
          <ConnectionCard
            key={1}
            updateMenu={updateMenu}
            id={patient.walletAddress}
            fname={patient.fname}
            lname={patient.lname}
            email={patient.email}
            designation={"Patient"}
          />
        ))}
      </div>
      <Menu
        anchorEl={anchorEl}
        id="Doctor Menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={()=>{setAccessPopup(true)}}>Grant Access</MenuItem>
        {/* <MenuItem
          onClick={() => { 
            navigate(routeConfig.reports);
            setParams({ doctorId: id });
          }}
        >
          Access reports
        </MenuItem> */}
        <MenuItem onClick={() => {setDoctorAccessPopup(true)}}>Access reports</MenuItem>
        <MenuItem onClick={()=>{removeConnection()}}>Remove Connection</MenuItem>
      </Menu>
      {/* <Dialog
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        open={accessPopup}
        onClose={() => setAccessPopup(false)}
      >
        <DialogContent>
          <section className="max-w-md relative overflow-y-auto flex flex-wrap gap-4 max-h-[500px] h-[95vh] bg-emerald-200">
            <article className="bg-white shadow-md rounded-md w-[200px] h-[200px]">
              <span>Report Name</span>
              <span>Report Tags</span>
            </article>
          </section>
        </DialogContent>
      </Dialog> */}
      <Dialog
            PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }}  
              maxWidth="lg"
            open={accessDoctorPopup} onClose={()=>setDoctorAccessPopup(false)}>
                <DialogContent>
                    <DoctorViewAccessReports doctorAddress={id}/>
                </DialogContent>
        </Dialog>
      <Dialog
            PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }}  
              maxWidth="lg"
            open={accessPopup} onClose={()=>setAccessPopup(false)}>
                <DialogContent>
                    <ViewAccessReports doctorAddress={id}/>
                </DialogContent>
        </Dialog>
    </section>
  );
};

export default ViewConnections;
