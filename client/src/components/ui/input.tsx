interface LabeledInputProps {
    label:string,
    textStyle?:string,
    inputStyle?:string,
    inputId?:string,
    name?:string;
    type?:string;
    className?:string,
    placeholder?:string
}

export const LabeledInput:React.FC<LabeledInputProps> = (props)=>{
    return(
        <div className="flex flex-col items-center w-full p-1">
            <label htmlFor={props.inputId} className="pb-1 text-sm self-start">{props.label}</label>
            <input placeholder={props.placeholder} name={props.name} type={props.type||"text"} className="border-[1px] w-full p-1 rounded-md border-black outline-none focus-within:outline-1 focus-within:outline-red-500 duration-200" id={props.inputId}/>
        </div>
    )
}

interface LabeledSelectProps extends LabeledInputProps{
    options:{name:string|number,value:string,optionStyle?:string}[],
    selectedStyle?:string,
    mutiple?:boolean,
    selectType?:"white",
    onChange?:(e)=>void
}

export const LabeledSelect:React.FC<LabeledSelectProps> =(props)=>{
    const color = props.selectType=="white"?"":"p-1 bg-white p-2 border-black focus:border-red-600 focus:outline-red-600 text-black"
    return(
        <div className="flex flex-col items-center w-fit">
            <label htmlFor={props.inputId} className="pb-1 text-sm self-start">{props.label}</label>
            <select onChange={props.onChange} name={props.name} multiple={props?.mutiple} defaultValue={""} className={`${color} rounded-md text-md border-[1px]`}> 
                <option  value={""}>-</option>
                {props?.options.map(ele=>{
                    return(
                        <option key={ele.value} value={ele.value} className={`${ele.optionStyle}`}>{ele.name}</option>
                    )
                })}
            </select>
        </div>
    )
}