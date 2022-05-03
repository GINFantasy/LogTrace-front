import Request from './request'
function paramsToFormData(obj:any):FormData {
    const formData = new FormData();
    Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Array) {
          obj[key].forEach((item:any) => {
            formData.append(key, item);
          });
          return;
        }
        formData.append(key, obj[key]);
      });
    return formData;
}
export const wsUrl:string = `ws://39.98.41.126:31100/siyuan/patch/log`; // 拿新日志
export const API = {
    getLog:'/siyuan/patch/log'
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
