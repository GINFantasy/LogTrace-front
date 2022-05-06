import React from "react"
import Log from "../pages/Log"

interface Route{
    title:string,
    path:string,
    component:React.FunctionComponent,
    children?:Route[]
}
const URL = location.pathname;
const routes:Route[] = [
    {
        title:"日志",
        path:"/log",
        component: Log
    },
    {
        title:"日志",
        path:"/",
        component: Log
    },
    {
        title:"日志",
        path:URL,
        component: Log
    }
]

export {routes}