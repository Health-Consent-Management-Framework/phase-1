interface LabeledInputProps {
    label:string,
    textStyle?:string,
    inputStyle?:string,
    inputId?:string,
    className?:string
}

export const LabeledInput:React.FC<LabeledInputProps> = (props)=>{
    return(
        <div className="flex flex-col items-center w-fit">
            <label htmlFor={props.inputId} className="pb-1 text-sm self-start">{props.label}</label>
            <input type={"text"} className="border-[1px] rounded-md border-black outline-none focus-within:outline-1 focus-within:outline-red-500 duration-200" id={props.inputId}/>
        </div>
    )
}

interface LabeledSelectProps extends LabeledInputProps{
    options:{name:string,value:string,optionStyle?:string}[],
    selectedStyle?:string,
    mutiple?:boolean
}

export const LabeledSelect:React.FC<LabeledSelectProps> =(props)=>{
    return(
        <div className="flex flex-col items-center w-fit">
            <label htmlFor={props.inputId} className="pb-1 text-sm self-start">{props.label}</label>
            <select multiple={props?.mutiple} defaultValue={""} className="bg-gray-300 text-sm border-[1px]"> 
                <option value={""}>-</option>
                {props?.options.map(ele=>{
                    return(
                        <option value={ele.value}>{ele.name}</option>
                    )
                })}
            </select>
        </div>
    )
}