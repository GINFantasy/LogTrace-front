import { Spin } from "antd"

export default function LoadingCover (props:{className?:string,loading:boolean,tip:string}){
    let {className,loading,tip} = props
    if(!className) className = '';
    return <div className={`spin-cover ${loading?'':'spin-cover-hidden'} ${className}`}>
        <Spin spinning={true} tip={tip}></Spin>
    </div>
}