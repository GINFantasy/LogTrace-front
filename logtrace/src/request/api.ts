import Request from './request'
const DOMAIN = location.href.split('http')[1];
const URL = location.pathname;
//export const wsUrl:string = `ws${DOMAIN}`; // 拿新日志
export const wsUrl:string = `ws://39.98.41.126:31100${URL}`; // 拿新日志

export const API = {
    getLog:URL
}

interface getlogParam{
    level:string,
    type:string,
    last:number,
    max:number
}
export const LogApi = {
    getLog:(param:getlogParam) => {
        return Request.get(`${API.getLog}/${param.level}/${param.type}/${param.last}/${param.max}`)
    }
}
