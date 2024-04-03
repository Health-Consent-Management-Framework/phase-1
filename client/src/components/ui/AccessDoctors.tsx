import { HiDotsVertical } from "react-icons/hi";

const AccessDoctors = (props) => {
  return (
    <div className="max-w-lg bg-white rounded-lg overflow-hidden shadow-lg my-1 mx-auto">
      <div className="px-6 py-4 flex flex-row items-center justify-between">
        <p className="font-bold text-xl">{props.doctorData.fname}</p>
        <p className="text-gray-700 text-base">{props.doctorData.designation}</p>
        <p className="text-gray-700 text-base">{props.doctorData.email}</p>
        <button
          aria-controls="doctor-menu"
          aria-haspopup="true"
          onClick={(e) => props.updateMenuOpen(e.currentTarget, props.doctorAddress)}
        >
          <HiDotsVertical />
        </button>
      </div>
    </div>
  );
};

export default AccessDoctors;
