import '../assets/styles/Log.scss'
import { LogMessage } from 'custom_types/Log';
import LogBox from '../components/LogBox';
import { useEffect, useState } from 'react';
import {wsUrl} from '../request/api'
import { LogApi } from '../request/api' 
import MySelect from '../components/MySelect'
import {TYPE,LEVEL} from '../data/test'
type Ws =  WebSocket | null 
const initLogParam = {
    level:'null',
    type:'null',
    last:0,
    max:10
}
export default function Log(){
    const [logData,setLogData] = useState<LogMessage[]>([]);
    // 处理websocket的函数
    let connect:boolean = false
    let ws:Ws = null;          
    let exit:boolean = false;

    const selectType = () => {
        
    }
    const selectLevel = () => {
        
    }
    useEffect(() => {
        createWebSocket(wsUrl);   //连接ws
        // 获取最近10条历史记录 
        LogApi.getLog(initLogParam).then((res)=>{
            const {data} = res;
            if(!data) return;
            setLogData((v:LogMessage[])=>data); 
        }).catch(err=>{
            console.log(err);
        })
        // 组件卸载时断开连接
        return () => {
            if(ws) closeSocket();
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
            console.log(res);
            console.log("连接错误!",res);
        };
        ws.onopen = function () {
            heartCheck.reset().start();      //心跳检测重置
            console.log("连接成功!");
        };
        ws.onmessage = function (res) {    //如果获取到消息，心跳检测重置
            heartCheck.reset().start();      //拿到任何消息都说明当前连接是正常的
            let data:LogMessage = JSON.parse(res.data);
            setLogData((v:LogMessage[])=>[data,...v]);
        }
    };
    return <div className='log-ct'>
        <aside>
            <div className="control-ct">
                <MySelect optionsList={LEVEL} title='日志级别' handleSelect={selectLevel}></MySelect>
                <MySelect optionsList={TYPE} title='日志类型'handleSelect={selectType} ></MySelect>
            </div>
        </aside>
        <div className="log-content">
            {
                logData.map((v:LogMessage,i)=><LogBox data={v} key={i}/>)
            } 
        </div>
    </div>
}

