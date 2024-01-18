interface ButtonProps{
    children:React.ReactNode,
    type?:"submit" | "reset" | "button" | undefined,
    onClick?:()=>void,
    buttonType?:"primary"|"dark"|"light",
    className?:string
}

export const Button:React.FC<ButtonProps> = (props)=>{
    const color = props.buttonType?"bg-red-600 text-black hover:bg-red-300 duration-300 ease-in":"text-black border-black"
    return(
        <button type={props.type} onClick={props.onClick||undefined} className={`focus-within:border-red-500 rounded-lg  p-1 px-2 text-sm duration-300 border-[1px] border-black ${color} hover:border-red-500 ${props.className} `}>
            {props.children}
        </button>
    )
}