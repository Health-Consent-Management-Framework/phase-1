import useContract from "../../hooks/useContract"
import { useCombinedContext } from "../../store"
import { Button } from "../ui"

const ProfileActions:React.FC = ()=>{
    const {role,user} = useCombinedContext()
    const adminContract = useContract(AdminAbi,AdminNetwork)
    // function createVerficationRequest(){
    //     if(role==2){

    //     }
    // }

    return(
        <article className="flex gap-3 flex-col">
        {
          !user.isVerified&&
            <Button type="button" onClick={()=>{createVerficationRequest()}}>
              Request Verification
            </Button>
        }
        <Button type="button" onClick={()=>{createVerficationRequest()}}>
          Delete Account
        </Button>
        </article>
    )
}

export default ProfileActions