import { MdSpaceDashboard } from "react-icons/md";
import { useState } from "react";
import { SlMenu } from "react-icons/sl";

const SideNav = () => {
  const [isOpen, setisOpen] = useState(false);
  const togglefunction = () => {
    setisOpen(!isOpen);
  }
  return (
    <>
      <div className="bg-slate-50 w-fit px-16 text-left hidden lg:block min-h-screen">
        <div className="">
          <p className="bg-[#4864d6] p-3 text-white font-semibold rounded-lg mt-10">+ Start Meeting</p>
        </div>
        <div className="py-10">
          <p className="py-2 flex items-center text-[17px] font-[450]"><MdSpaceDashboard /><span className="ml-2">Hello 1</span></p>
          <p className="py-2 flex items-center text-[17px] font-[450]"><MdSpaceDashboard /><span className="ml-2">Hello 123</span></p>
          <p className="py-2 flex items-center text-[17px] font-[450]"><MdSpaceDashboard /><span className="ml-2">Hello 12345</span></p>
          <p className="py-2 flex items-center text-[17px] font-[450]"><MdSpaceDashboard /><span className="ml-2">Hello 1234567</span></p>
        </div>
      </div>
      <div className="md:hidden">
        <button onClick={togglefunction}> <SlMenu /> </button>
      </div>
    </>
  )
}

export default SideNav