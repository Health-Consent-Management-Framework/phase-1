import { useEffect, useState } from "react";
import { LabeledInput, LabeledSelect,Button } from "./ui"
import {abi ,networks} from '../contracts/Facility.json'
import { useWalletContext } from "../store/walletProvider";
import { Contract } from "web3";
import { useNotificationContext } from "../store/notificationProvider";

interface facility{
    facilityName:string,
    facilityType:string,
    street:string,
    pincode:string,
    state:string,
    district:string
}

type ABI = typeof abi;

export const AddFacility:React.FC = ()=>{
    const [facilty,setFacility] = useState<facility|null>()
    const {web3,networkId,wallet} = useWalletContext();
    const [contract,setContract] = useState<Contract<ABI>|null>()
    const {updateNotification} = useNotificationContext()

    const handleSubmit = (e)=>{
        e.preventDefault();
        const {name,type,street,pincode,state,district} = e.target;
        console.log(name.value)
        setFacility({
            facilityName:name.value,
            facilityType:type.value,
            street:street.value,
            state:state.value,
            district:district.value,
            pincode:pincode.value
        })
    }
    
    const initContract = async () => {
        try {
          if(web3&&networkId){
            const deployedNetwork = networks[networkId];
            if(!deployedNetwork.address){
                throw new Error("Deploy the contract")
            }
            const instance = new web3.eth.Contract(
              abi,
              deployedNetwork.address
              );
              setContract(instance);
            }
        } catch (error) {
            updateNotification({type:"error",message:"contract not deployed"})
            console.error('Error initializing contract', error);
        }
    }

    
    useEffect(()=>{
        async function createFacility(){
            if(facilty){
                console.log(facilty)
                
                const transaction = await contract?.methods.createFacility(
                    facilty.facilityName,facilty.state,
                    facilty.district,facilty.street,facilty.pincode,Number(facilty.facilityType)
                ).send({from:wallet.accounts[0],gas:"5000000"})
                if(transaction?.status==1){
                    updateNotification({type:"success",message:"Facilty Created"})
                }
                if(Number(transaction?.status)===0){
                    updateNotification({type:"success",message:"Failed to create facility"})
                }
            }
        }
        createFacility()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[facilty])
    
    useEffect(()=>{
        if(web3&&networkId) initContract()
    },[web3, networkId])

        return(
            <section className="w-full h-full items-center justify-center flex mt-16">
            <form onSubmit={handleSubmit} className="bg-blue-300 inline-block max-w-[500px] w-full m-auto shadow-md shadow-black p-3 pt-5 px-5 rounded-lg">
                <h1 className="text-center font-bold text-2xl pb-4">Create Facility</h1>
                <div className="flex gap-1 flex-wrap justify-between">
                    <div className="max-w-sm">
                        <LabeledInput placeholder={`Enter facility name`} name="name" label="name"/>
                    </div>
                    <div>
                        <LabeledSelect placeholder={`Enter facility Type`} name="type" label="type" options={[{value:0,name:"local"},{value:1,name:"state"},{name:"national",value:2}]}/>
                    </div>
                </div>
                <div className="flex justify-between">
                        <LabeledInput label="street" name="street" placeholder="enter the Locality of facility"/>
                    <LabeledInput label="pincode" name="pincode" placeholder="pincode"/>
                </div>
                <div className="flex gap-1 " id="Address">
                    <LabeledSelect name="state" label="state" options={[{value:"AP",name:"Andhra Pradesh,AP"}]}/>
                    <LabeledSelect name="district" label="district" options={[{value:"KNL",name:"Kurnool,KNL"}]}/>
                </div>
                <div className="mt-2 flex justify-center">
                    {/* <textarea>
                        workers details
                    </textarea> */}
                </div>
                <div className="mt-2 flex justify-center items-center">
                    <Button className="bg-blue-800 text-white border-blue-200 shadow-blue-400">Submit</Button>
                </div>
            </form>
        </section>
    )
}

export const Facilities:React.FC = ()=>{

    const [facilties,setFacilites] = useState<facility[]>([])
    const {web3,networkId,wallet} = useWalletContext();
    const [contract,setContract] = useState<Contract<ABI>|null>()
    const {updateNotification} = useNotificationContext()

    const initContract = async () => {
        try {
          if(web3&&networkId){
            const deployedNetwork = networks[networkId];
            if(!deployedNetwork.address){
                throw new Error("Deploy the contract")
            }
            const instance = new web3.eth.Contract(
              abi,
              deployedNetwork.address
              );
              setContract(instance);
            }
        } catch (error) {
            updateNotification({type:"error",message:"contract not deployed"})
            console.error('Error initializing contract', error);
        }
    }

    useEffect(()=>{
        if(web3&&networkId) initContract()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[web3,networkId])

    useEffect(()=>{
        console.log("called")
        async function getFacilites(){
            if(contract){
                console.log("inside")
                const data = await contract.methods.getFacilities().call({from:wallet.accounts[0]}) 
                setFacilites(data as facility[])
                console.log(data)
            }
        }
        getFacilites()
    },[contract])


    return(
        <section>
            <div className="p-3" id="facilities-wrapper">
                these are facilities
                {facilties.map((ele,index)=>(                    
                    <article key={index} className="border-[1px] cursor-pointer border-black p-2 hover:border-red-200  duration-300 rounded-lg w-[200px] shadow-lg flex flex-col">
                        <img className="bg-red-200 h-24 rounded-lg w-full mb-2" />
                        <div className="flex flex-col">
                            <span className="uppercase font-bold text-sm">{ele.name}</span>
                            <span className="w-full flex justify-between">
                            <span className="text-sm ">facility type</span>
                            <span className="text-xs font-bold inline-block ms-auto bg-red-200 rounded-md px-1 pt-[2px] uppercase">{`${ele.location.state}-${ele.location.district}`}</span>
                            </span>
                            <span className="text-xs text-justify px-2">this is some information about the facility on how it is to be made in the canopy and all</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}