import {abi,networks} from '../../contracts/Doctor.json';
import { Button, LabeledSelect } from '../ui';
import useContract from '../../hooks/useContract';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombinedContext } from '../../store';

export const AddDoctorPatient:React.FC = () => {
  const {wallet} = useCombinedContext();
  const contract = useContract(abi,networks)
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault();
      if(contract) {
        const {doctorAddress,patientAddress} = e.target;
        const transaction = await contract?.methods.addPatientToDoctor(doctorAddress.value,patientAddress.value).send({ from: wallet.accounts[0],gas:"1000000" });
        console.log(transaction)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error submitting transaction', error);
    }
  };


  return (
    <section className="m-auto flex items-center flex-col justify-center pt-10">
    <form onSubmit={handleSubmit} className="flex flex-col bg-blue-200 gap-2 border-2 border-blue-500 shadow-lg py-5 rounded-2xl px-4">
            <h1 className="text-4xl font-medium text-blue-800 pb-5 text-center">Add Patient to doctor</h1>
            <div className="flex justify-center">
                <LabeledSelect textStyle="text-blue-700 capitalize" name="doctorAddress" label="doctor Address" options={wallet.accounts.map(ele=>({value:ele,name:ele}))} />
            </div>
            <div className="flex justify-center">
                <LabeledSelect textStyle="text-blue-700 capitalize" name="patientAddress" label="patient Address" options={wallet.accounts.map(ele=>({value:ele,name:ele}))} />
            </div>
            <div className={`flex gap-3 justify-center pt-3`}>
                <Button className="bg-blue-500 text-white hover:border-blue-700 hover:bg-blue-300" loader={loading}>Add</Button>
                <Button className="hover:border-blue-700 hover:text-blue-700" onClick={()=>navigate('/')}>Home</Button>
            </div>
    </form>
</section>
  );
};

