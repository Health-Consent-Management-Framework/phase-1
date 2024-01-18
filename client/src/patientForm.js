import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PatientRecordSystemContract from './contracts/PatientRecordSystem.json'; // Import your compiled contract artifacts

const PatientForm = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(window.web3);
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        setWeb3(window.web3);
      } else {
        console.error('Web3 not found. Please use a web3-enabled browser like MetaMask.');
      }
    };

    const initContract = async () => {
      try {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PatientRecordSystemContract.networks[networkId];
        const instance = new web3.eth.Contract(
          PatientRecordSystemContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);
      } catch (error) {
        console.error('Error initializing contract', error);
      }
    };

    const initAccounts = async () => {
      try {
        const accs = await web3.eth.getAccounts();
        setAccounts(accs);
      } catch (error) {
        console.error('Error fetching accounts', error);
      }
    };

    initWeb3();
    initContract();
    initAccounts();
  }, [web3]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await contract.methods.createPatient(name, age).send({ from: accounts[0] });
      setTransactionHash('Transaction successful!');
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

//not connected to any main file