import { DialogContent, IconButton, Menu, MenuItem } from '@mui/material'
import { useCallback } from 'react'
import avatar from '../assets/avatar.png'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { abi as ConnectionAbi,networks as ConnectionNetworks } from '../contracts/Connection.json'
import { MoreVert } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import {Dialog} from '@mui/material'
import { routeConfig } from '../router'
import useContract from '../hooks/useContract'
import { useCombinedContext } from '../store'
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
import { useCalendarState } from '@mui/x-date-pickers/internals'

interface cardProps{
    fname:string,
    lname:string,
    email:string,
    designation:string,
    updateMenu:(ele:HTMLElement,id:string)=>void,
    id:string
}

const ConnectionCard:React.FC<cardProps> = ({fname,lname,email,designation,updateMenu,id})=>{
    return(
        <article className="w-48 flex relative py-3 pt-8 flex-col items-center h-48 border-2 shadow-md rounded-md">   
            <img className='w-16 h-16' src={avatar}/>
            <span className='pt-2 font-medium'>{fname} {lname}</span>
            <span className='font-medium text-blue-600 pt-3'>{designation}</span>
            <span className='absolute top-2 right-2'>
                <IconButton onClick={(e)=>updateMenu(e.currentTarget,id)}>
                    <MoreVert/>
                </IconButton>
            </span>
        </article>
    )
}

const ViewConnections:React.FC = ()=>{
    const {selectedWallet} = useCombinedContext()
    const [anchorEl,setAnchorEl] = useState<HTMLElement | null>(null)
    const contract = useContract(ConnectionAbi,ConnectionNetworks)
    const UserContract = useContract(UserAbi,UserNetworks);
    const patientContract = useContract(PatientAbi, PatientNetworks);
    const doctorContract = useContract(DoctorsAbi, DoctorsNetworks);
    const [params,setParams] = useSearchParams()
    const [accessPopup,setAccessPopup] = useState(false)
    const [id,setId] = useState('')
    const navigate = useNavigate()
    const [doctorAddresses, setDoctorAddresses] = useState<string[]>([]);
    const [patientAddresses, setPatientAddresses] = useState<string[]>([]);
    // const [patientsData, setpatientsData] = useState([]);
    const [patientsData, setPatientsData] = useState([
        { fname: "John", email: "john@example.com" },
        { fname: "Alice", email: "alice@example.com" },
        // Add more dummy patient data as needed
    ]);
    const [doctorsData, setDoctorsData] = useState([]);

    function handleMenuClose(){
        setAnchorEl(null)
        setId('')
    }

    function updateMenu(ele,id){
        setAnchorEl(ele);
        setId(id);
    }
    
    async function getConnections() {
        const data = await contract?.methods.getConnections(selectedWallet).call({ from: selectedWallet });
        if (data) {
            // const addresses: string[] = data.map((item: any) => item.address);
            data.forEach(async (address: string) => {
                const role = await UserContract?.methods.getUserRole(address).call({ from: selectedWallet });
                if (role == 3) {
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
                const doctorData = await doctorContract.methods.getDoctor(doctorAddress).call({ from: selectedWallet });
                return doctorData;
            })
        );
        setDoctorsData(doctorsData);
    }, [doctorAddresses, doctorContract, selectedWallet]);
    
    useEffect(() => {
        fetchDoctorsData();
    }, [fetchDoctorsData]);
    
    const fetchPatientsData = useCallback(async () => {
        const patientsData = await Promise.all(
            patientAddresses.map(async (patientAddress) => {
                const patientData = await patientContract.methods.getPatient(patientAddress).call({ from: selectedWallet });
                return patientData;
            })
        );
        setpatientsData(patientsData);
    }, [patientAddresses, patientContract, selectedWallet]);
    
    useEffect(() => {
        fetchPatientsData();
    }, [fetchPatientsData]);

    useEffect(()=>{
        if(contract){
            getConnections()
        }
    },[contract])

    return(
        <section className="h-screen flex flex-col">
           <article className="w-full px-10 py-3 border-b-2">
                <h1 className="text-2xl font-medium">Connections</h1>
           </article>
           <div className="p-8 flex gap-5">
                {patientsData.map((patient) => (
                    <ConnectionCard updateMenu={updateMenu} id={11} fname={patient.fname} lname={"Alpha"} email={"user1@gmail.com"} designation={"Cardiologist"}/>
                ))}
                <ConnectionCard updateMenu={updateMenu} id={10} fname={"User"} lname={"Alpha"} email={"user1@gmail.com"} designation={"Cardiologist"}/>
           </div>
           <Menu
                anchorEl={anchorEl}
                id="Doctor Menu"
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>Grant Access</MenuItem>
                <MenuItem onClick={()=>{
                    navigate(routeConfig.reports);
                    setParams({doctorId:id})
                }}>view my access</MenuItem>
                <MenuItem>Delete Connection</MenuItem>
            </Menu>
            <Dialog
            PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }}  
            open={accessPopup} onClose={()=>setAccessPopup(false)}>
                <DialogContent>
                    <section className='max-w-md relative overflow-y-auto flex flex-wrap gap-4 max-h-[500px] h-[95vh] bg-emerald-200'>
                        <article className='bg-white shadow-md rounded-md w-[200px] h-[200px]'>
                            {/* <img src='' className=''/> */}
                            <span>Report Name</span>
                            <span>Report Tags</span>
                        </article>
                    </section>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default ViewConnections