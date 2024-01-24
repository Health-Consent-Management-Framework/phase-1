import { useState, useEffect } from 'react';
import {abi,networks} from '../contracts/PatientRecordSystem.json';
import { useWalletContext } from '../store/walletProvider';
import { Contract } from "web3-eth-contract"
import { LabeledInput, Button } from './ui';

type ABI = typeof abi

const PatientForm = () => {
  const {web3,networkId,wallet} = useWalletContext();
  const [contract, setContract] = useState<Contract<ABI>|null>(null);
  const [transactionHash, setTransactionHash] = useState('');

  useEffect(() => {
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
        console.error('Error initializing contract', error);
      }
    };

    if(web3){
      initContract();
    }
  }, [networkId, web3]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if(contract) {
        const {fname,lname,age} = e.target
        const transaction = await contract?.methods.createPatient(fname.value, Number(age.value)).send({ from: wallet.accounts[0],gas:"30000" });
        setTransactionHash(transaction?.blockHash||"")
      }
    } catch (error) {
      console.error('Error submitting transaction', error);
      setTransactionHash('Transaction failed!');
    }
  };

  return (
    <div>
      <h2>Create Patient</h2>
      <form onSubmit={handleSubmit} className="bg-blue-300 inline-block m-auto p-3 rounded-lg">
                <h1 className="text-center font-bold">Create Patient</h1>
                <div className='flex'>
                  <div className="max-w-sm">
                      <LabeledInput label="fname" name="fname"/>
                  </div>
                  <div className="max-w-sm">
                      <LabeledInput label="lname" name="lname"/>
                  </div>
                </div>
                <div>
                  <div className='w-20'>
                    <LabeledInput label="age" name="age"/>
                  </div>
                  <LabeledInput label='address' />
                </div>
                <div className="mt-2 flex justify-center items-center">
                    <Button className="bg-blue-800 text-white border-blue-200 shadow-blue-400" type='submit'>Submit</Button>
                </div>
                <p>
                    {transactionHash}
                </p>
            </form>
      <p>Transaction Hash: {transactionHash}</p>
    </div>
  );
};

export default PatientForm;
