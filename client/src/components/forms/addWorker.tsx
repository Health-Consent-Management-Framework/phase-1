import { useNavigate, useParams } from "react-router-dom"
import { LabeledInput, LabeledSelect,Button } from "../ui"
import { useState } from "react"
import {abi as workerABI,networks as workerNetwork} from '../../contracts/Worker.json'
import useContract from "../../hooks/useContract"
import { useCombinedContext } from "../../store"


export const AddWorker:React.FC = ()=>{
    const navigate = useNavigate()
    const {wallet,updateNotification} = useCombinedContext()
    const contract = useContract(workerABI,workerNetwork)
    const [loading,setLoading] = useState(false)
    const params = useParams();


    const handleSubmit = async (e) => {
        try {
          e.preventDefault();
          setLoading(true)
          // console.log(contract);
          if(contract) {
            const {fname,lname,DoB,phoneno,address,email,gender,height,weight} = e.target
            const [day,month,year] = DoB.value.split('-').map(ele=>ele)
            console.log(day,month,year)
            console.log(fname.value,lname.value,email.value,phoneno.value,day,month,year,address.value,params.id)
            const transaction = await contract?.methods.createWorker(
                                        fname.value,
                                        lname.value,
                                        email.value,
                                        phoneno.value,
                                        gender.value,
                                        height.value,
                                        weight.value,
                                        day,month,year,
                                        params.id
                                      )
                    .send({ from: wallet.accounts[1],gas:"1000000" });
            console.log(transaction)
            const events = transaction.events
            if(events&&Object.keys(events).includes('WorkerCreated')){
              updateNotification({type:'success',message:"User created successfully"})
              navigate('/')
            }else if(events&&Object.keys(events).includes('WorkerFound')){
              updateNotification({type:'success',message:"User created successfully"})
              navigate('/')
            }
          }
        } catch (error) {
          console.error('Error submitting transaction', error);
        }
        setLoading(false)
      };

    return(
        <section className="m-auto flex items-center flex-col justify-center pt-10">
            <form onSubmit={handleSubmit} 
            className="flex flex-col bg-red-200 gap-2 border-2 border-red-500 shadow-lg py-5 rounded-2xl px-4">
                    <h1 className="text-4xl font-medium text-red-800 pb-5 text-center">Add Worker</h1>
                    <div className="flex items-center justify-center">
                        <LabeledInput outlineColor="red" textStyle="text-red-700 capitalize" label="first name" name="fname"/>
                        <LabeledInput outlineColor="red" textStyle="text-red-700 capitalize" label="last name" name="lname"/>
                    </div>
                        <LabeledInput textStyle="text-red-700 capitalize" label="Email" name="email"/>
                    <div className='flex gap-5'>
                        <LabeledInput textStyle="text-red-700 capitalize" type="text" name="phoneno" label="phone number"/>
                        <LabeledInput textStyle="text-red-700 capitalize" type="date" name="DoB" label="date of birth"/>
                    </div>
                    <div className='flex gap-5'>
                        <LabeledSelect textStyle='text-red-700 capitalize' name="gender" label="Gender" options={[{value:'M',name:'Male'},{value:'F',name:'female'}]} />
                        <LabeledInput textStyle='text-red-700 capitalize' label='Height' name='height'/>
                        <LabeledInput textStyle='text-red-700 capitalize' label='Weight' name='weight'/>
                    </div>
                    <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
                        <LabeledInput textStyle='text-red-700 capitalize' name='address' label='Address'/>
                    </div>
                    <div className={`flex gap-3 justify-center pt-3`}>
                        <Button className="bg-red-500 text-white hover:border-red-700 hover:bg-red-300" loader={loading}>Add Worker</Button>
                    </div>
            </form>
        </section>
    )
}