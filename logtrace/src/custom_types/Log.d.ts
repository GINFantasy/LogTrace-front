type LogMode = 'INLINE' | 'RECORD' | 'DETAIL'
type LOGType = 'SYSTEM' | ''

/**
 * 参数类型
 */
export type Param = {
    key:string,
    value:string
} 

/**
 * 日志信息
 */
export type LogData = {
    level:string,       // 方法入参记录
    site:string,
    content:string | null,     // 内容
    paramList:Param[]| null   // 入参列表
} | null

/**
 * 日志返回值格式
 */
export interface LogMessage{
    read:0 | 1,             // 是否已读
    createTime:string,      // 产生时间
    level:string,           // 级别
    thread:string,          // 所在线程
    site:string,            // 产生位置
    mode:LogMode,           // 日志模式
    type:string,            // 日志类别
    requestPath:string,     // 请求路径
    className:string,       // 请求父类
    methodName:string,      // 请求方法
    paramList:Param[],      // 入参列表
    returnString:string,    // 请求返回值
    logDataList:LogData[],  // 具体日志信息列表
    stackList:string[]      // 堆栈调用信息
}