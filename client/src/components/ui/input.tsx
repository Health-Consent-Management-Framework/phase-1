interface LabeledInputProps {
    label:string,
    textStyle?:string,
    inputStyle?:string,
    inputId?:string,
    name?:string;
    type?:string;
    outlineColor?:string,
    className?:string,
    placeholder?:string,
    disabled?:boolean
}

export const LabeledInput:React.FC<LabeledInputProps> = (props)=>{
    return(
        <div className="flex flex-col items-center w-full p-1">
            <label htmlFor={props.inputId} className={`pb-1 ${props.textStyle} text-sm self-start`}>{props.label}</label>
            <input disabled={props.disabled} placeholder={props.placeholder} name={props.name} type={props.type||"text"} className={`border-[1px] w-full p-1 rounded-md border-black outline-none focus-within:outline-1 focus-within:outline-${props.outlineColor}-500 duration-200 ${props.inputStyle}`} id={props.inputId}/>
        </div>
    )
}

interface LabeledSelectProps extends LabeledInputProps{
    options:{name:string,value:string|number,optionStyle?:string,selected?:boolean}[],
    selectedStyle?:string,
    mutiple?:boolean,
    selectType?:"white",
    notFit?:boolean,
    onChange?:(e)=>void
}

export const LabeledSelect:React.FC<LabeledSelectProps> =(props)=>{
    const color = props.selectType=="white"?"":`p-1 bg-white p-2 border-black focus:border-${props.outlineColor}-600 focus:outline-${props.outlineColor}-600 text-black`
    return(
        <div className={`flex flex-col items-center max-w-sm ${!props.notFit?'w-fit':''}`}>
            <label htmlFor={props.inputId} className={`pb-1 text-sm self-start ${props.textStyle}`}>{props.label}</label>
            <select onChange={props.onChange} name={props.name} multiple={props?.mutiple} className={`${color} rounded-md text-md max-w-[275px] border-[1px]`}> 
                <option  value={""}>-</option>
                {props?.options.map(ele=>{
                    return(
                        <option selected={ele.selected} key={ele.value} value={ele.value} className={`${ele.optionStyle}`}>{ele.name}</option>
                    )
                })}
            </select>
        </div>
    )
}