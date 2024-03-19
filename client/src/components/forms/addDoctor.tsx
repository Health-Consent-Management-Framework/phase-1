import {abi,networks} from '../../contracts/Doctor.json';
import { useWalletContext } from '../../store/walletProvider';
import { LabeledInput, Button, LabeledSelect } from '../ui';
import useContract from '../../hooks/useContract';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddDoctor = () => {
  const {wallet} = useWalletContext();
  const contract = useContract(abi,networks)
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if(contract) {
        const {fname,lname,DoB,doctorAddress,email,phoneno,designation} = e.target
        const [day,month,year] = DoB.value.split('-').map(ele=>Number(ele))
        const transaction = await contract?.methods.createDoctor(fname.value,lname.value,designation.value,email.value,doctorAddress.value,day,month,year).send({ from: wallet.accounts[0],gas:"1000000" });
        // navigate('/patient', { state: { patientAddress: patientAddress.value } });
        navigate('/doctor', { state: { doctorAddress: doctorAddress.value } });
      }
    } catch (error) {
      console.error('Error submitting transaction', error);
    }
  };

//   useEffect(()=>{
//     async function getPatients(){
//       const transaction = await contract?.methods.getAllPatient().call({from:wallet.accounts[0]})
//       console.log(transaction)
//     }
//     getPatients()
//   },[contract])

  return (
    <section className="m-auto flex items-center flex-col justify-center pt-10">
    <form onSubmit={handleSubmit} className="flex flex-col bg-blue-200 gap-2 border-2 border-blue-500 shadow-lg py-5 rounded-2xl px-4">
            <h1 className="text-4xl font-medium text-blue-800 pb-5 text-center">Add Details</h1>
            <div className="flex items-center justify-center">
                <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="first name" name="fname"/>
                <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="last name" name="lname"/>
            </div>
            <div className="flex items-center justify-center">
                <LabeledInput textStyle="text-blue-700 capitalize" label="Designation" name="designation"/>
                <LabeledInput textStyle="text-blue-700 capitalize" label="Email" name="email"/>
            </div>
            <div className='flex gap-5'>
              <LabeledInput textStyle="text-blue-700 capitalize" type="text" name="phoneno" label="phone number"/>
              <LabeledInput textStyle="text-blue-700 capitalize" type="date" name="DoB" label="date of birth"/>
            </div>
            <div className="flex justify-center">
                <LabeledSelect textStyle="text-blue-700 capitalize" name="doctorAddress" label="walletAddress" options={wallet.accounts.map(ele=>({value:ele,name:ele}))} />
            </div>
            <div className={`flex gap-3 justify-center pt-3`}>
                <Button className="bg-blue-500 text-white hover:border-blue-700 hover:bg-blue-300" loader={loading}>Add Doctor</Button>
                <Button className="hover:border-blue-700 hover:text-blue-700" onClick={()=>navigate('/')}>Home</Button>
            </div>
    </form>
</section>
  );
};

