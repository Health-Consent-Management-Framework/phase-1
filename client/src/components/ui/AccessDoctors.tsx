import { MoreVert } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import avatar from '../../assets/avatar.png'
import { useCombinedContext } from "../../store";

const AccessDoctors = (props) => {
  const { role } = useCombinedContext();
  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm my-1 mx-auto">
      <div className="px-6 py-4 flex flex-row items-center justify-between">
        <img src={avatar} className="rounded-full w-10 h-10"/>
        <p className="font-bold text-xl">{props.doctorData.fname}</p>
        <p className="text-gray-700 text-base">{props.doctorData.designation}</p>
        <p className="text-gray-700 text-base">{props.doctorData.email}</p>
        {role==4 && <IconButton
          aria-controls="doctor-menu"
          aria-haspopup="true"
          onClick={(e) => props.updateMenuOpen(e.currentTarget, props.doctorAddress)}
        >
          <MoreVert />
        </IconButton>}
      </div>
    </div>
  );
};

export default AccessDoctors;
