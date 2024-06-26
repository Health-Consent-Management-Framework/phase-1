import {abi,networks} from '../../contracts/Patient.json';
import { LabeledInput, Button, LabeledSelect } from '../ui';
import useContract from '../../hooks/useContract';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { useCombinedContext } from '../../store';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


export const AddPatient:React.FC = () => {
  const {selectedWallet,updateNotification} = useCombinedContext();
  const contract = useContract(abi,networks)
  const params = useParams()
  const navigate = useNavigate()
  const [date,setDate] = useState()
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      if(contract) {
        const {fname,lname,phoneno,address,email,gender,height,weight} = e.target
        const dateValue = new Date(date).getTime()
        console.log(fname.value,lname.value,email.value,phoneno.value,dateValue,address.value,params.id)
        const transaction = await contract?.methods.createPatient(fname.value,lname.value,email.value,phoneno.value,gender.value,height.value,weight.value,dateValue,selectedWallet,params.id).send({ from: selectedWallet,gas:"1000000" });
        console.log(transaction)
        const events = transaction.events
        if(Object.keys(events).includes('PatientCreated')){
          updateNotification({type:'success',message:"User created successfully"})
          navigate('/')
        }else if(Object.keys(events).includes('PatientFound')){
          updateNotification({type:'success',message:"Patient already has found"})
          navigate('/')
        }
      }
    } catch (error) {
      console.error('Error submitting transaction', error);
    }
    setLoading(false)
  };


  return (
    <section className="m-auto flex items-center flex-col justify-center pt-10">
      <form onSubmit={handleSubmit} className="flex flex-col bg-blue-200 gap-2 border-2 border-blue-500 shadow-lg py-5 rounded-2xl px-4">
            <div className='w-full flex items-center justify-center'>
              <BeatLoader size={10} loading={loading} color='blue'/>
            </div>
            <h1 className="text-4xl font-medium text-blue-800 pb-5 text-center">Add Details</h1>
            <div className="flex items-center justify-center">
                <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="first name" name="fname"/>
                <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="last name" name="lname"/>
            </div>
                <LabeledInput textStyle="text-blue-700 capitalize" label="Email" name="email"/>
            
            <div className='flex gap-5'>
              <LabeledSelect textStyle='text-blue-700 capitalize' name="gender" label="gender" options={[{value:'M',name:'Male'},{value:'F',name:'female'}]} />
              <LabeledInput textStyle='text-blue-700 capitalize' label='Height' name='height'/>
              <LabeledInput textStyle='text-blue-700 capitalize' label='Weight' name='weight'/>
            </div>
            <div className='flex items-center gap-5'>
              <LabeledInput textStyle="text-blue-700 capitalize" type="text" name="phoneno" label="phone number"/>
              <div>
                <label>Date of Birth</label>
                <DatePicker
                sx={{padding:0,border:'2px solid black'}}
                value={date}
                onChange={(value)=>setDate(dayjs(value))}
                slotProps={{
                  textField:{
                    inputProps:{
                      style:{
                        padding:'7.5px 10px',
                        // border:'2px solid black'
                      }
                    },
                    sx:{
                      backgroundColor:"white",
                      borderRadius:2,
                      border:'2px solid black'
                    }
                  }
                }}
                name='DoB' format='DD-MM-YYYY'/>
              </div>
              {/* <LabeledInput textStyle="text-blue-700 capitalize" type="date" name="DoB" label="date of birth"/> */}
              {/* <LabeledInput textStyle='text-blue-700 capitalize' label='pincode' name='pincode'/> */}
            </div>
            <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
              <LabeledInput textStyle='text-blue-700 capitalize' name='address' label='Address'/>
            </div>
            <div className={`flex gap-3 justify-center pt-3`}>
                <Button className="bg-blue-500 text-white hover:border-blue-700 hover:bg-blue-300" loader={loading}>Add Patient</Button>
            </div>
    </form>
</section>
  );
};

