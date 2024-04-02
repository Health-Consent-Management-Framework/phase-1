import { MoreVert } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import avatar from '../../assets/avatar.png'

const AccessDoctors = (props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); 
  const [id, setId] = useState('');

  function updateMenuOpen(event: React.MouseEvent<HTMLElement>, id: string) {
    setAnchorEl(event.currentTarget);
    setId(id);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
    setId("");
  };

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm my-1 mx-auto">
      <div className="px-6 py-4 flex flex-row items-center justify-between">
        <img src={avatar} className="rounded-full w-10 h-10"/>
        <p className="font-bold text-xl">{props.doctorData.fname}</p>
        <p className="text-gray-700 text-base">{props.doctorData.designation}</p>
        <p className="text-gray-700 text-base">{props.doctorData.email}</p>
        <IconButton
          aria-controls="doctor-menu"
          aria-haspopup="true"
          onClick={(e) => updateMenuOpen(e, id)}
        >
          {/* You can use any icon or text for the button */}
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="doctor-menu"
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={()=>{}}>Visit Profie</MenuItem>
          <MenuItem onClick={handleMenuClose}>Revoke access</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default AccessDoctors;
