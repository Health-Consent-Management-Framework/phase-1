import { LabeledInput, LabeledSelect,Button } from "./ui"

const AddFacility = ()=>{
    const handleSubmit = (e)=>{
        e.preventDefault();
    }
    return(
        <section>
            <form onSubmit={handleSubmit} className="bg-blue-300 inline-block m-auto p-3 rounded-lg">
                <h1 className="text-center font-bold">Create Facility</h1>
                <div className="flex gap-1 flex-wrap justify-between">
                    <div className="max-w-sm">
                        <LabeledInput name="name" label="name"/>
                    </div>
                    <div>
                        <LabeledSelect label="type" options={[{value:"local",name:"local"}]}/>
                    </div>
                </div>
                <div className="max-w-sm">
                    <LabeledInput label="street" name="street"/>
                </div>
                <div className="flex gap-1 flex-wrap" id="Address">
                    <LabeledSelect label="state" options={[{value:"AP",name:"Andhra Pradesh,AP"}]}/>
                    <LabeledSelect label="district" options={[{value:"AP",name:"Andhra Pradesh,AP"}]}/>
                </div>
                <div className="mt-2 flex justify-center">
                    <textarea>
                        workers details
                    </textarea>
                </div>
                <div className="mt-2 flex justify-center items-center">
                    <Button className="bg-blue-800 text-white border-blue-200 shadow-blue-400">Submit</Button>
                </div>
            </form>
        </section>
    )
}

export const Facilities:React.FC = ()=>{
    return(
        <section>
            <div className="p-3" id="facilities-wrapper">
                these are facilities
                <article className="border-[1px] cursor-pointer border-black p-2 hover:border-red-200  duration-300 rounded-lg w-[200px] shadow-lg flex flex-col">
                    <img className="bg-red-200 h-24 rounded-lg w-full mb-2" />
                    <div className="flex flex-col">
                        <span className="uppercase font-bold text-sm">facility Name</span>
                        <span className="w-full flex justify-between">
                        <span className="text-sm ">facility type</span>
                        <span className="text-xs font-bold inline-block ms-auto bg-red-200 rounded-md px-1 pt-[2px] uppercase">Ap</span>
                        </span>
                        <span className="text-xs text-justify px-2">this is some information about the facility on how it is to be made in the canopy and all</span>
                    </div>
                </article>
            </div>
            <AddFacility/>
        </section>
    )
}