import { Param } from "custom_types/Log";
import '../assets/styles/ParamList.scss'
export default function ParamList(props:{data:Param[] | null | undefined}){
    const {data} = props;
    if(!data) {
        return <></>
    }
    return <ol className="param-list">
        {data?.map((v,i)=>
            <li className="param-item" key={i}>
                <span className="param-key">{v.key}</span>
                <span className="param-value">：{v.value}</span>
            </li>
        )}
    </ol>
}