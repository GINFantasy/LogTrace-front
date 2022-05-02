import { React } from "react"
import Log from "../pages/Log"

interface Route{
    title:string,
    path:string,
    component:React.component,
    children?:Route[]
}

const routes:Route[] = [
    {
        title:"主页",
        path:"/",
        component: Log
    }
]

export {routes}