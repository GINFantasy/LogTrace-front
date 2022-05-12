import { LogData } from "custom_types/Log";
import ParamList from "./ParamList";
import "../assets/styles/InfoItem.scss";
import MyParagraph from "./MyParagraph";
/**
 * @description: 信息输出列表元素
 * @param {object} props
 * @return {*}
 * @author: GuluGuluu
 */
export default function InfoItem(props: { data: LogData,locateCode:Function }) {
  const { data,  locateCode } = props;
  if(!data) {
    return <></>
  }
  return (
    <li className="log-info-item">
      <span className={`info-level-${data.level}`}>{data.level}</span>
      <span className="info-site" onClick={()=>locateCode(data.site)}>{data.site}</span>：
      {data?.content ? (
        <MyParagraph rows={3} text={data.content} />
      ) : (
        <ParamList data={data?.paramList} />
      )}
    </li>
  );
}