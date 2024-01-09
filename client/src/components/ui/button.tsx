interface ButtonProps{
    children:React.ReactNode,
    type?:"primary"|"dark"|"light",
    onClick?:()=>void
}

export const Button:React.FC<ButtonProps> = (props)=>{
    const color = props.type?"bg-red-600 text-black hover:bg-red-300 duration-300 ease-in":"text-black border-black"
    return(
        <button onClick={props.onClick||undefined} className={`focus-within:border-red-500 rounded-lg  p-1 px-2 text-sm duration-300 border-[1px] border-black ${color} hover:border-red-500`}>
            {props.children}
        </button>
    )
}