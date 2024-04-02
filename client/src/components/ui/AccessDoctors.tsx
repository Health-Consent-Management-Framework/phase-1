import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

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
    <div className="max-w-lg bg-white rounded-lg overflow-hidden shadow-lg my-1 mx-auto">
      <div className="px-6 py-4 flex flex-row items-center justify-between">
        <p className="font-bold text-xl">John Wick</p>
        <p className="text-gray-700 text-base">Software Engineer</p>
        <p className="text-gray-700 text-base">1234567890</p>
        <button
          aria-controls="doctor-menu"
          aria-haspopup="true"
          onClick={(e) => updateMenuOpen(e, id)}
        >
          {/* You can use any icon or text for the button */}
          <HiDotsVertical />
        </button>
        <Menu
          anchorEl={anchorEl}
          id="doctor-menu"
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleMenuClose}>Revoke access</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default AccessDoctors;
