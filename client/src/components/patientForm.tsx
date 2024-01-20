import { useState, useEffect } from 'react';
import {abi,networks} from '../contracts/PatientRecordSystem.json';
import { useWalletContext } from '../store';
import { Contract } from "web3-eth-contract"

type ABI = typeof abi

const PatientForm = () => {
  const {web3,networkId,wallet} = useWalletContext();
  const [contract, setContract] = useState<Contract<ABI>|null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
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
  }, [web3]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if(contract) {
        console.log("inside")
        const transaction = await contract?.methods.createPatient(name, age).send({ from: wallet.accounts[0] });
        console.log(transaction)
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
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Age:
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <br />
        <button type="submit">Add Patient</button>
      </form>
      <p>Transaction Hash: {transactionHash}</p>
    </div>
  );
};

export default PatientForm;
