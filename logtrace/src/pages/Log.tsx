import '../assets/styles/Log.scss'
import { LogMessage } from 'custom_types/Log';
import LogBox from '../components/LogBox';
import { useEffect, useState } from 'react';
import {wsUrl} from '../request/api'
import { LogApi } from '../request/api' 
import MySelect from '../components/MySelect'
import { TYPE,LEVEL } from '../data/test'
import { Message } from '../utils/index'
import { Empty,Badge } from 'antd'
import LoadingCover from '../components/LoadingCover'
import {handleScrollBottom,debounce} from '../utils/index'
type Ws =  WebSocket | null 
const MAX:number = 10;
const initLogParam = {
    level:'ALL',
    type:'ALL',
    last:0,
    max:10
}
let nowPage = 1;
let nowLogIndex = -1;
const handleLogScroll = (callback:Function,offset:number) => {
    handleScrollBottom(callback,50);
    if(nowLogIndex === -1) {
        return;
    } 
    const logboxs = document.querySelectorAll('.log-box');
    const lastSawLogTop = (logboxs[logboxs.length - nowLogIndex] as HTMLElement).offsetTop;
    let scrollTop=document.documentElement.scrollTop;
    
}

const addScrollListener = (callback:Function) => {
    window.addEventListener("scroll", debounce(()=>handleLogScroll(callback,50), 500));
}

export default function Log(){
    const [count,setCount] = useState<number>(0);
    const [loading,setLoading] = useState<boolean>(true);
    const [logData,setLogData] = useState<LogMessage[]>([]);
    const [type,setType] = useState<string>('ALL');
    const [level,setLevel] = useState<string>('ALL');
    // 处理websocket的函数
    let connect:boolean = false
    let ws:Ws = null;          
    let exit:boolean = false;

    const recordNewLog = (logdata:LogMessage[]) => { 
        if(nowLogIndex === -1){
            nowLogIndex = logdata.length;
        }
        setCount(v=>{
            return v + 1
        });
    }

    const filter = ()=>{
        let param = {
            type,
            level,
            last:0,
            max:MAX
        }
        setLoading(true);
        LogApi.getLog(param).then(res=>{
            const {data} = res;   
            if(!(data instanceof Array)){
                Message.error('服务器返回数据格式非数组，请检查！');
            }            
            else {
                setLogData(data);
            }
            setLoading(false);
        }).catch(err=>{
            throw err;
        })
    }

    const addLog = ()=>{
        let param = {
            type,
            level,
            last:nowPage++,
            max:MAX
        }
        Message.loading('正在获取日志...');
        LogApi.getLog(param).then(res=>{
            const {data} = res;   
            if(!(data instanceof Array)){
                Message.error('服务器返回数据格式非数组，请检查！');
            }            
            else {
                let scrollTop=document.documentElement.scrollTop// 滚动条在Y轴滚动过的高度
                setLogData(v=>{
                    return [...v,...data]
                });
                document.documentElement.scrollTop = scrollTop;
            }
            Message.destroy();
        }).catch(err=>{
            throw err;
        })
    }

    useEffect(() => {
        createWebSocket(wsUrl);   //连接ws
        // 获取最近10条历史记录 
        LogApi.getLog(initLogParam).then((res)=>{
            const {data} = res;
            if(!data) return;
            setLogData((v:LogMessage[])=>data); 
            setLoading(false)
        }).catch(err=>{
            throw err;
        })
        addScrollListener(addLog)
        // 组件卸载时断开连接
        return () => {
            if(ws) closeSocket();
            window.removeEventListener("scroll", debounce(()=>handleScrollBottom(addLog,50), 500));
        }
    },[])

    const closeSocket = () => {
        exit = true;
        ws?.close();   // 关闭
    }
    const reconnect = (wsUrl:string) => {
        if(connect || exit) return;
        connect = true;
        setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
            createWebSocket(wsUrl);
            connect = false;
        }, 2000);
    }

    interface HeartCheck {
        timeout:number,
        timeoutObj:number | undefined,
        serverTimeoutObj:number | undefined,
        reset:Function,
        start:Function
    }
    //心跳检测
    const heartCheck:HeartCheck = {
        timeout: 30000,        //1分钟发一次心跳
        timeoutObj: undefined,
        serverTimeoutObj: undefined,
        reset: function(){
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            return this;
        },
        start: function(){
            let self = this;
            this.timeoutObj = setTimeout(function(){
                // 这里发送一个心跳，后端收到后，返回一个心跳消息，
                // onmessage拿到返回的心跳就说明连接正常
                ws?.send("ping");
                // self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                //     console.log(123);
                    
                //     ws?.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                // }, self.timeout)
            }, this.timeout)
        }
    }

    const createWebSocket = (url:string)=> {
        try{
            if('WebSocket' in window){
                ws = new WebSocket(url);
                initEventHandle(ws);
            }
        }catch(e){
            reconnect(url);
        }     
    }

    const initEventHandle = (ws:Ws) => {
        if(!ws) return;
        ws.onclose = function () {
            reconnect(wsUrl);
            console.log("连接关闭!");
            connect = false;
        };
        ws.onerror = function (res) {
            connect = false;
            console.log("连接错误!",res);
        };
        ws.onopen = function () {
            heartCheck.reset().start();      //心跳检测重置
            console.log("连接成功!");
        };
        ws.onmessage = function (res) {    // 如果获取到消息，心跳检测重置
            heartCheck.reset().start();      // 拿到任何消息都说明当前连接是正常的
            // let scrollTop=document.documentElement.scrollTop// 滚动条在Y轴滚动过的高度
            // let scrollHeight=document.documentElement.scrollHeight// 滚动条的高度
            // let data:LogMessage = JSON.parse(res.data);
            // setLogData((v:LogMessage[])=>{
            //     recordNewLog(v);
            //     return [data,...v];
            // });
            
            // // 设置滚动条位置，防止新日志进来时当前视口往下滑
            // document.documentElement.scrollTop = scrollTop + document.documentElement.scrollHeight - scrollHeight;
        }
    };
    return <div className='log-ct'>
        <aside>
            <div className="control-ct">
                <MySelect optionsList={LEVEL} title='日志级别' handleSelect={setLevel}></MySelect>
                <MySelect optionsList={TYPE} title='日志类型'handleSelect={setType} ></MySelect>
                <div className="control-filter" onClick={filter}>筛选</div>
            </div>
        </aside>
        <div className="log-content">   
            <div className="back-top-box">
                <Badge count={count} color='volcano'>
                    <div className='backtop-btn' title='回到顶部'>↑</div>
                </Badge>
            </div>
            <LoadingCover loading={loading} tip='加载中...'/>
            {
                logData.length === 0
                ?<Empty></Empty>
                :logData.map((v:LogMessage,i:number)=><LogBox data={v} key={`${v.createTime}-${v.className}-${i}`}/>)
            } 
        </div>
    </div>
}

