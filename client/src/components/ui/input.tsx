interface LabeledInputProps {
    label:string,
    textStyle?:string,
    inputStyle?:string,
    inputId?:string
}

export const LabeledInput:React.FC<LabeledInputProps> = (props)=>{
    return(
        <div className="flex flex-col items-center w-fit">
            <label htmlFor={props.inputId} className="pb-1 text-sm self-start">{props.label}</label>
            <input type={"text"} className="border-[1px] rounded-md border-black outline-none focus-within:outline-1 focus-within:outline-red-500 duration-200" id={props.inputId}/>
        </div>
    )
}