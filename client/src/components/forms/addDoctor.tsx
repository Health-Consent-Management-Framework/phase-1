import {abi,networks} from '../../contracts/Doctor.json';
import { LabeledInput, Button } from '../ui';
import useContract from '../../hooks/useContract';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCombinedContext } from '../../store';
import { Autocomplete, Chip, TextField } from '@mui/material';

export const AddDoctor:React.FC = () => {

  const contract = useContract(abi,networks)
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const [degrees,setDegrees] = useState<string[]>([])
  const {updateNotification} = useCombinedContext()
  const params = useParams()

  const handleSubmit = async (e) => {
    try {
      setLoading(true)
      e.preventDefault();
      if(contract) {
        const {fname,lname,DoB,email,phoneno,designation} = e.target
        const date = new Date(DoB.value).getTime()
        console.log(phoneno)
        console.log(
          fname.value,
          lname.value,
          email.value,
          phoneno.value,
          designation.value,
          degrees,
          date,
          params.id          
        )
        const transaction = await contract?.methods.createDoctor(
                                                    fname.value,
                                                    lname.value,
                                                    email.value,
                                                    phoneno.value,
                                                    designation.value,
                                                    degrees,
                                                    date
                                                    )
                                                  .send({ from: params.id,gas:"1000000" });
        // navigate('/patient', { state: { patientAddress: patientAddress.value } });
        const events = transaction.events;
        if(Object.keys(events).includes('DoctorCreated')){
          updateNotification({type:'success',message:"Doctor Created Successfu;;y"})
          navigate('/')
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('Error submitting transaction', error);
    }
  };



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
              <div className="flex justify-evenly">
                    <Autocomplete
                        clearIcon={false}
                        options={degrees}
                        freeSolo
                        fullWidth
                        multiple
                        renderTags={(value, props) =>{
                            setDegrees(value)
                            return value.map((ele, index) => {
                            return <Chip label={ele} {...props({ index })} />
                            })
                        }}
                        renderInput={(params) => 
                        <div className="px-1">
                            <label className="pb-1 text-sm self-start">Degrees</label>
                            <TextField  sx={{
                                '& .MuiOutlinedInput-root': {
                                    padding:0,
                                    border:'1px solid black',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRight:"10px"
                                },
                            }} className={`border-[1px] w-full p-1 rounded-md border-black outline-none focus-within:outline-1 duration-200`} {...params} />
                        </div>
                        }/>
                    </div>
            <div className={`flex gap-3 justify-center pt-3`}>
                <Button className="bg-blue-500 text-white hover:border-blue-700 hover:bg-blue-300" loader={loading}>Add Doctor</Button>
            </div>
    </form>
</section>
  );
};

