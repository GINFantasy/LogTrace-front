import { LogData } from "custom_types/Log";
import ParamList from "./ParamList";
import '../assets/styles/InfoItem.scss'
import MyParagraph from "./MyParagraph";
import { useRef,useState } from "react";
let text = '请求连接 id=18 发来数据请求请求连接 id=18 发来数据请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping：ping连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping请求连接 id=18 发来数据：ping：ping'
export default function InfoItem(props:{data:LogData}){
    const {data} = props;
    const infoContent = useRef<HTMLSpanElement | null>(null);
    // const [ellipsis,setEllipsis] = useState<boolean>(infoContent.current.h)
    return <li className="log-info-item">
        <span className={`info-level-${data?.level}`}>{data?.level}</span>
        <span className="info-site">{data?.site}</span>
        ：
        {
            data?.content
            ?<MyParagraph rows={3} text={data.content}/>
            :<ParamList data={data?.paramList}/>
        }
    </li>
}