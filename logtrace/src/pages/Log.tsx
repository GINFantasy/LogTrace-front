import "../assets/styles/Log.scss";
import { LogMessage } from "custom_types/Log";
import LogBox from "../components/LogBox";
import { useEffect, useState, useRef } from "react";
import { wsUrl } from "../request/api";
import { LogApi } from "../request/api";
import MySelect from "../components/MySelect";
import { TYPE, LEVEL } from "../data/options";
import { Message } from "../utils/index";
import { Empty, Badge } from "antd";
import LoadingCover from "../components/LoadingCover";
import { handleScrollBottom, debounce } from "../utils/index";
type Ws = WebSocket | null;
const MAX: number = 10;
const initLogParam = {
  level: "ALL",
  type: "ALL",
  last: 0,
  max: 10,
};
let nowPage = 1; // 当前日志的页数
let nowLogIndex = -1; // 用于标识最近一条新日志的索引

// 获取
type RelativeDistanceCallback = (
  targetOffsetTop: number,
  initialOffsetTop: number
) => void;
const getRelativeDistance = (
  className: string,
  index: number,
  callback: RelativeDistanceCallback
) => {
  if (index <= 0) return;
  const targetDoms = document.querySelectorAll(className);
  const targetOffsetTop = (targetDoms[index - 1] as HTMLElement)?.offsetTop;
  const initialOffsetTop = (targetDoms[0] as HTMLElement).offsetTop;
  callback(targetOffsetTop, initialOffsetTop);
};
/**
 * @description: 日志页
 * @author: GuluGuluu
 */
export default function Log() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [logData, setLogData] = useState<LogMessage[]>([]);
  const [type, setType] = useState<string>("ALL");
  const [level, setLevel] = useState<string>("ALL");
  // 创建IntersectionObserver示例，用于监听日志是否进入视口，进入则停止监听
  const observerRef = useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { target, intersectionRatio } = entry;
          // 已进入视口的元素
          if (intersectionRatio > 0) {
            const targetDom = target as HTMLImageElement;
            const nowIndex = parseInt(targetDom.dataset["index"] as string);
            // 将新日志数设置为已进入视口的新日志的索引
            if (nowIndex <= nowLogIndex) {
              setCount(nowIndex);
            }
            observerRef.current.unobserve(targetDom);
          }
        });
      },
      {
        // -50px为导航栏高度
        rootMargin: "-50px 0px 0px 0px",
      }
    )
  );

  // 处理websocket的变量
  let connect: boolean = false;
  let ws: Ws = null;
  let exit: boolean = false;

  // 回到第一条新日志
  const backToTheFirstNewLog = () => {
    if (nowLogIndex <= 0) {
      document.documentElement.scrollTop = 0;
      return;
    };
    setCount((v) => v--);
    getRelativeDistance(
      ".log-box",
      nowLogIndex,
      (targetOffsetTop, initialOffsetTop) => {
        document.documentElement.scrollTop = targetOffsetTop - initialOffsetTop;
      }
    );
  };

  // 添加滚动事件
  const addScrollListener = (callback: Function) => {
    window.addEventListener(
      "scroll",
      debounce(() => handleScrollBottom(callback), 500)
    );
  };
  // 筛选
  const filter = () => {
    let param = {
      type,
      level,
      last: 0,
      max: MAX,
    };
    setLoading(true);
    LogApi.getLog(param)
      .then((res) => {
        const { data } = res;
        if (!(data instanceof Array)) {
          Message.error("服务器返回数据格式非数组，请检查！");
        } else {
          setLogData(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };
  // 底部获取历史日志
  const addLog = () => {
    let param = {
      type,
      level,
      last: nowPage++,
      max: MAX,
    };
    Message.loading("正在获取日志...");
    LogApi.getLog(param)
      .then((res) => {
        const { data } = res;
        if (data.length === 0) {
          Message.warning("暂无历史日志");
          return;
        } else if (!(data instanceof Array)) {
          Message.error("服务器返回数据格式非数组，请检查！");
        } else {
          let scrollTop = document.documentElement.scrollTop; // 滚动条在Y轴滚动过的高度
          setLogData((v) => {
            return [...v, ...data];
          });
          document.documentElement.scrollTop = scrollTop;
        }
        Message.destroy();
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    createWebSocket(wsUrl); //连接ws
    // 获取最近10条历史记录
    LogApi.getLog(initLogParam)
      .then((res) => {
        const { data } = res;
        if (data.length === 0) {
          Message.warning("暂无历史日志");
          setLoading(false);
          return;
        }
        setLogData((v: LogMessage[]) => data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
    addScrollListener(addLog);
    // 组件卸载时断开连接
    return () => {
      if (ws) closeSocket();
      window.removeEventListener(
        "scroll",
        debounce(() => handleScrollBottom(addLog), 500)
      );
      observerRef.current.disconnect();
    };
  }, []);

  const closeSocket = () => {
    exit = true;
    ws?.close(); // 关闭
  };
  const reconnect = (wsUrl: string) => {
    if (connect || exit) return;
    connect = true;
    setTimeout(function () {
      //没连接上会一直重连，设置延迟避免请求过多
      createWebSocket(wsUrl);
      connect = false;
    }, 2000);
  };

  interface HeartCheck {
    timeout: number;
    timeoutObj: number | undefined;
    serverTimeoutObj: number | undefined;
    reset: Function;
    start: Function;
  }
  //心跳检测
  const heartCheck: HeartCheck = {
    timeout: 30000, //1分钟发一次心跳
    timeoutObj: undefined,
    serverTimeoutObj: undefined,
    reset: function () {
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      return this;
    },
    start: function () {
      this.timeoutObj = setTimeout(function () {
        ws?.send("ping");
      }, this.timeout);
    },
  };

  const createWebSocket = (url: string) => {
    try {
      if ("WebSocket" in window) {
        ws = new WebSocket(url);
        initEventHandle(ws);
      }
    } catch (e) {
      reconnect(url);
    }
  };

  const initEventHandle = (ws: Ws) => {
    if (!ws) return;
    ws.onclose = function () {
      reconnect(wsUrl);
      console.log("连接关闭!");
      connect = false;
    };
    ws.onerror = function (res) {
      connect = false;
      console.log("连接错误!", res);
    };
    ws.onopen = function () {
      heartCheck.reset().start(); //心跳检测重置
      console.log("连接成功!");
    };
    ws.onmessage = async (res) => {
      // 如果获取到消息，心跳检测重置
      heartCheck.reset().start(); // 拿到任何消息都说明当前连接是正常的
      let scrollTop = document.documentElement.scrollTop; // 滚动条在Y轴滚动过的高度
      let scrollHeight = document.documentElement.scrollHeight; // 滚动条的高度
      let data: LogMessage = JSON.parse(res.data);
      await setLogData((v: LogMessage[]) => {
        return [data, ...v];
      });
      // 当出现滚动条时才计数
      if (scrollTop !== 0) {
        setCount((i) => i + 1);
      }
      // 设置滚动条位置，防止新日志进来时当前视口往下滑
      document.documentElement.scrollTop =
        scrollTop + document.documentElement.scrollHeight - scrollHeight - 20;
    };
  };

  useEffect(() => {
    nowLogIndex = count;
  }, [count]);

  useEffect(() => {
    let tempLogData = Array.from(document.querySelectorAll(".log-box")).slice(
      0,
      nowLogIndex + 1
    );
    tempLogData.forEach((v) => {
      observerRef.current.unobserve(v);
      observerRef.current.observe(v);
    });
  }, [logData]);

  return (
    <div className="log-ct">
      <aside>
        <div className="control-ct">
          <MySelect
            optionsList={LEVEL}
            title="日志级别"
            handleSelect={setLevel}
          ></MySelect>
          <MySelect
            optionsList={TYPE}
            title="日志类型"
            handleSelect={setType}
          ></MySelect>
          <div className="control-filter" onClick={filter}>
            筛选
          </div>
        </div>
      </aside>
      <div className="log-content">
        <div className="back-top-box">
          <Badge count={count} color="volcano">
            <div
              className="backtop-btn"
              onClick={backToTheFirstNewLog}
              title="回到第一条新日志"
            >
              ↑
            </div>
          </Badge>
        </div>
        <LoadingCover loading={loading} tip="加载中..." />
        {logData.length === 0 ? (
          <Empty></Empty>
        ) : (
          logData.map((v: LogMessage, i: number) => (
            <LogBox
              data={v}
              index={i}
              key={`${v.createTime}-${v.className}-${i}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
