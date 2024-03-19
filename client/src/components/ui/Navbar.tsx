/* eslint-disable no-unused-vars */

const Navbar = (props) => {
    return (
        <div className='w-[100%] flex justify-between bg-slate-50'>
            <h1 className='text-[24px] font-bold p-5 pl-16'>HCMS</h1>
            <div className='flex p-5 pr-20 items-center'>
                <img src='/tree.jpg' alt='image' className='hidden md:block w-[40px] h-[40px] rounded-full '></img>
                <div className='ml-2 text-left'>
                    <p className='font-bold'>{props.name}</p>
                    <p className='font-medium text-[12px]'>{props.designation}</p>
                </div>
            </div>
        </div>
    )
}

export default Navbar