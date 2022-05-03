import axios from 'axios'
import { message } from 'antd';
const DOMAIN = import.meta.env.VITE_BASE_API;  // 接口根路径
const Request = axios.create({
    baseURL:DOMAIN,
})
// axios拦截器
Request.interceptors.request.use((config:any) => { 
  config.headers = {
    'Content-Type': 'application/json; charset=utf-8',   //登录不用token
  }

  return config
}, (error:any) => { 
  message.error({content: '请求超时!'});
  return Promise.resolve(error);
})

Request.interceptors.response.use((data:any)=> {
  if(!data){
    message.error({content: '数据获取异常'});
    return;
  }
  return data;
}, (err:any)=> {
  if (err.response.status === 504||err.response.status === 404) {
    message.error({content: '服务器出现问题！'});
  }else if (err.response.status === 401) {
    message.error({content: '请先登录!'});
  } else if (err.response.status === 403) {
    message.error({content: '权限不足,请联系管理员!'});
  }else {
    message.error({content: '未知错误！'});
  }
  return Promise.resolve(err);
})


export default Request