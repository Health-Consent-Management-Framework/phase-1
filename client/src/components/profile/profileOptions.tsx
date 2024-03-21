import { useCombinedContext } from "../../store"
import { Button } from "../ui"

const ProfileActions:React.FC = ()=>{
    const {user} = useCombinedContext()
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