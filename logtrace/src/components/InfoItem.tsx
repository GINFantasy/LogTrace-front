import { LogData } from "custom_types/Log";
import ParamList from "./ParamList";
import '../assets/styles/InfoItem.scss'
export default function InfoItem(props:{data:LogData}){
    const {data} = props;

    return <li className="log-info-item">
        <span className={`info-level-${data?.level}`}>{data?.level}</span>
        <span className="info-site">{data?.site}</span>
        ：
        {
            data?.content
            ?<span className={`info-content ${data.level==='ERROR'?'error-text':''}`}>{data.content}</span>
            :<ParamList data={data?.paramList}/>
        }
    </li>
}