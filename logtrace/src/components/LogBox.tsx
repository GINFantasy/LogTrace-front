import { LogMessage } from "custom_types/Log";
import { useState } from "react";
import "../assets/styles/LogBox.scss";
import InfoItem from "./InfoItem";
import ParamList from "./ParamList";
/**
 * @description: 日志盒子
 * @param {object} props 日志数据 索引值
 * @author: GuluGuluu
 */
export default function LogBox(props: { data: LogMessage, index: number, locateCode:Function}) {
  const { data, index ,locateCode} = props;
  if (!data) return <></>;
  const [isRead, setIsRead] = useState<number>(data.read);
  const [isFold, setIsFold] = useState<number>(data.read);
  const switchFold = () => {
    if (!isRead) {
      // 设置为已读

      setIsRead(1);
    }

    setIsFold((v: number) => {
      if (v === 1) return 0;
      else return 1;
    });
  };

  return (
    <div className="log-box" data-index={index}>
      <div
        className={`log-header ${isFold ? "log-header-isread" : ""}`}
        onClick={switchFold}
      >
        <span className="log-createTime" title="产生时间">
          {data.createTime}
        </span>
        <span className={`log-level-${data.level}`} title="级别">
          {data.level}
        </span>
        <span className="log-thread" title="所在线程">
          {data.thread}
        </span>
        <span className="log-site" title="产生位置">
          {data.site}
        </span>
        <span className="log-mode" title="日志模式">
          {data.mode}
        </span>
        <span className="log-type" title="日志类别">
          {data.type}
        </span>
        <span
          className={`iconfont icon-zhedie ${isFold ? "isread" : ""}`}
        ></span>
      </div>
      {data.mode !== "INLINE" ? (
        <ol className={`log-main ${isFold ? "log-main-isread" : ""}`}>
          <li className="main-title">
            请求路径：<span>{data.requestPath}</span>
          </li>
          <li className="main-title">
            所属父类：<span>{data.className}</span>
          </li>
          <li className="main-title">
            所属方法：<span>{data.methodName}</span>
          </li>
          {data.paramList === null? (
            <></>
          ) : (
            <li className="main-title">
              传入参数：
              <ParamList data={data.paramList} />
            </li>
          )}
          <li className="main-title">
            请求返回：<span>{data.returnString}</span>
          </li>
          <li className="main-title">
            信息输出：
            <ol className="log-datalist">
              {data.logDataList.map((v, i) => (
                <InfoItem
                  data={v}
                  locateCode={locateCode}
                  key={`${data.createTime}-${data.logDataList}-${i}`}
                />
              ))}
            </ol>
          </li>
          {data.level === "ERROR" && data.stackList ? (
            <li className="main-title">
              堆栈调用：
              <ol className="log-stackList">
                {data.stackList.map((v, i) => (
                  <li key={`${data.createTime}-${data.logDataList}-${i}`}>
                    {v}
                  </li>
                ))}
              </ol>
            </li>
          ) : (
            <></>
          )}
        </ol>
      ) : (
        <ol className={`log-datalist ${isFold ? "log-main-isread" : ""}`}>
          {data.logDataList.map((v, i) => (
            <InfoItem
              locateCode={locateCode}
              data={v}
              key={`${data.createTime}-${data.logDataList}-${i}`}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
