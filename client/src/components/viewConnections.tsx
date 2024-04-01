import { DialogContent, IconButton, Menu, MenuItem } from '@mui/material'
import avatar from '../assets/avatar.png'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { abi as ConnectionAbi,networks as ConnectionNetworks } from '../contracts/Connection.json'
import { MoreVert } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import {Dialog} from '@mui/material'
import { routeConfig } from '../router'
import useContract from '../hooks/useContract'
import { useCombinedContext } from '../store'

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
    const [params,setParams] = useSearchParams()
    const [accessPopup,setAccessPopup] = useState(false)
    const [id,setId] = useState('')
    const navigate = useNavigate()

    function handleMenuClose(){
        setAnchorEl(null)
        setId('')
    }

    function updateMenu(ele,id){
        setAnchorEl(ele);
        setId(id);
    }

    async function getConnections(){
        const data = await contract?.methods.getConnections(selectedWallet).call({from:selectedWallet});
        console.log(data)
        // return data;
    }

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
           <div className="p-8">
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