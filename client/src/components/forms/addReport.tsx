import { useState } from "react";
import { LabeledInput, Button } from "../ui"
import {storage} from '../../firebaseconfig'
import { useCombinedContext } from "../../store";
import useContract from "../../hooks/useContract";
import { abi as reportAbi, networks as reportNetworks} from '../../contracts/Report.json';
import { Autocomplete, Chip, TextField } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { BeatLoader } from "react-spinners";

interface Report{
    diagnoisedDoctor?:string,
    doctorId:string[],
    attachements?:string[],
    diagnosis:string[],
    tags:string[]
    createdAt:Date,
    updatedAt:Date
}


export const AddReport:React.FC = ()=>{
    const {updateNotification,wallet} = useCombinedContext()
    const reportContract = useContract(reportAbi,reportNetworks)
    const [loading,setLoading] = useState(false)
    const [tags,setTags] = useState<string[]>([])

    const handleFileUpload = async (file) => {
        try {
          const storageRef = ref(storage,file.name);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          return downloadURL;
          // You can use the downloadURL to display or download the uploaded file
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
    const handleSubmit = async(e)=>{
        console.log(wallet.accounts[0])
        try{
            setLoading(true)
            e.preventDefault();
            const {problem,attachements} = e.target
            console.log(problem.value,attachements.value,tags)
            console.log(attachements.files[0])
            const downloadUrl = [await handleFileUpload(attachements.files[0])]
            console.log(downloadUrl)
            const data = await reportContract?.methods.createTempReport(
                problem.value,
                downloadUrl,
                tags
            ).send({from:wallet.accounts[0]})
            if(Number(data?.status)){
                updateNotification({type:'success',message:"Created report successfully"})
            }
        }catch(err){
            console.log(err)
            updateNotification({type:'error',message:'Failed to creater Report'})
        }
        setLoading(false)
    }
    

    return(
            <form onSubmit={handleSubmit} 
                className="flex flex-col bg-blue-200 gap-2 border-2 border-blue-500 shadow-lg py-5 rounded-2xl px-4">
                    <div className="items-center w-full justify-center">
                        <BeatLoader loading={loading} size={10}/>
                    </div>
                    <h1 className="text-4xl font-medium text-blue-800 pb-5 text-center">Add Report</h1>
                    <div className="flex items-center justify-center gap-5">
                        <LabeledInput outlineColor="blue" textStyle="text-blue-700 capitalize" label="Problem" name="problem"/>
                    </div>
                    <div className="flex items-center justify-center duration-500 flex-wrap md:flex-nowrap">
                        <LabeledInput label="attachements" type="file" name="attachements"></LabeledInput>
                    </div>
                    <div className="flex justify-evenly">
                    <Autocomplete
                        clearIcon={false}
                        options={tags}
                        freeSolo
                        fullWidth
                        multiple
                        renderTags={(value, props) =>{
                            setTags(value);
                            return value.map((ele, index) => {
                            return <Chip label={ele} {...props({ index })} />
                            })
                        }}
                        renderInput={(params) => 
                        <div className="px-1">
                            <label className="pb-1 text-sm self-start">Tags</label>
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
                        
                        {/* <LabeledInput /> */}
                    </div>
                    <div className={`flex gap-3 justify-center pt-3`}>
                        <Button className="bg-blue-500 text-white hover:border-blue-700 hover:bg-blue-300" loader={loading}>Add Report</Button>
                        <Button className="hover:border-blue-700 hover:text-blue-700" type="'reset">Clear</Button>
                    </div>
            </form>
    )
}
