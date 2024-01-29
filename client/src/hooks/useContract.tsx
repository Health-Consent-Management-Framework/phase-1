import { useEffect, useState } from "react"
import { useNotificationContext } from "../store/notificationProvider"
import { useWalletContext } from "../store/walletProvider"
import { Contract } from "web3"

export default function useContract(abi,networks){
    const [contract,setContract] = useState<Contract<typeof abi>>()
    const {web3,networkId} = useWalletContext()
    const {updateNotification} = useNotificationContext();
    useEffect(()=>{
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
                console.log(error)
                updateNotification({type:"error",message:"contract not deployed"})
                console.error('Error initializing contract', error);
            }
        }
        if(web3&&networkId) initContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[web3, networkId,abi,networks])
    return contract;
}