import { useEffect, useState } from 'react';
import {LabeledInput,Button} from './ui'
import { Contract } from 'web3';
import {abi,networks} from '../contracts/NameStorage.json'
import { useWalletContext } from '../store';

export function NameForm(){
    type ABI = typeof abi
    const [contract,setContract] = useState<Contract<ABI>|null>(null)
    const {web3,wallet,networkId} = useWalletContext()
    const [transactionHash,setTransactionHash] = useState<string>()

    useEffect(()=>{
        const initContract = ()=>{
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
                console.error('Error initializing contract', error);
              }
        }
        initContract();
    },[web3])

    async function handleSubmit(e){
        if(contract)
            e.preventDefault();
            const {name} = e.target
            console.log(name.value)
            const transaction = await contract?.methods.addName(name.value).send({ from: wallet.accounts[0] });
            setTransactionHash(transaction?.blockHash.toString()||"failed")
        }

    return(
        <form onSubmit={handleSubmit} className="bg-blue-300 inline-block m-auto p-3 rounded-lg">
                <h1 className="text-center font-bold">Create Facility</h1>
                <div className="max-w-sm">
                    <LabeledInput label="name" name="name"/>
                </div>
                <div className="mt-2 flex justify-center items-center">
                    <Button className="bg-blue-800 text-white border-blue-200 shadow-blue-400" type='submit'>Submit</Button>
                </div>
                <p>
                    {transactionHash}
                </p>
            </form>
    )
}