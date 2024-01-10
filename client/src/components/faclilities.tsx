import { LabeledInput, LabeledSelect } from "./ui"

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
            <form>
                <LabeledInput label="name"/>
                <LabeledInput label="type"/>
                <LabeledSelect label="state" options={[{value:"AP",name:"Andhra Pradesh,AP"}]}/>
            </form>
        </section>
    )
}