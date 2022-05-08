import { message } from "antd"
import { useEffect } from "react"
export const Message = {
    config:{
      duration:1.5
    },
    success: function(content:string){
      message.success({...this.config,content})
    },
    error:function(content:string){
      message.error({...this.config,content})
    },
    warning:function(content:string){
      message.warning({...this.config,content})
    },
    loading:function(content:string){
        message.loading({...this.config,content})
    },
    destroy:function(){
        message.destroy();
    }
}

export const handleScrollBottom=(callback:Function,offset:number)=>{
    let scrollTop=document.documentElement.scrollTop//滚动条在Y轴滚动过的高度
    let scrollHeight=document.documentElement.scrollHeight//滚动条的高度
    let clientHeight=document.documentElement.clientHeight//浏览器的可视高度
    if(scrollTop+clientHeight >= scrollHeight - offset){
        callback();
    }
}
type Timer = number | null;
export function debounce(fn:Function, delay:number) {
    let timer:Timer = null; //借助闭包
    return function () {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(fn, delay); // 简化写法
    };
}

export function getLineNumber(dom:HTMLElement | null,lineheight:number){ 
    if(dom === null){
      return 3;
    }    
    let styles = window.getComputedStyle(dom, null);
    let h = parseInt(styles.height, 10);
    return h/lineheight;
}

export const useMount = (callback:Function) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
