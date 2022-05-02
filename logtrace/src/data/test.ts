let logdata = [
    {
        "read": 0,	// 是否已读
        "createTime": "2022-05-01 20:01:10",  // 产生时间
        "level": "ERROR",  // 级别，当为 ERROR 时会有堆栈打印信息 stackList
        "thread": "http-nio-18010-exec-3",  // 所在线程
        "site": "iceclean.customlog.spi.LogAdvice",  // 产生位置
        "mode": "DETAIL",  // 日志模式
        "type": "SYSTEM",  // 日志类别
        "requestPath": "/bindTemplate",  // 请求路径
        "className": "class com.iceclean.siyuanpatch.controller.TemplateController",  // 请求父类
        "methodName": "bindTemplate",  // 请求方法
        "paramList": [  // 入参列表（和单条日志的入参列表格式相同）
            {
                "key": "blockId",
                "value": "20220327144400-490eiqu"
            },
            {
                "key": "kindId",
                "value": "KIND：1002"
            }
        ],
        "returnString": "null",  // 请求返回值
        "logDataList": [  // 具体日志信息列表
            {
                "level": "COME",  // 方法入参记录
                "site": "TemplateServiceImpl_bindTemplate",
                "content": null,  // COME 级别的，content 为空
                "paramList": [    // 相对应的 paramList 会保存入参列表
                    {
                        "key": "blockId",
                        "value": "20220327144400-490eiqu"
                    },
                    {
                        "key": "targetId",
                        "value": "null"
                    }
                ]
            },
            {
                "level": "INFO",  // 普通记录
                "site": "SiYuanServiceImpl.java:123 setAttribute",
                "content": "为块 [20220327144400-490eiqu] 添加属性 [custom-template-id] 成功 => 1002",
                "paramList": null  // 普通日志和返回值记录日志，参数列表为空，内容非空
            },
            {
                "level": "EXIT",  // 退出方法记录
                "site": "SiYuanServiceImpl_setAttribute",
                "content": "null",
                "paramList": null
            },
            {
                "level": "ERROR",  // 错误日志，
                "site": "TemplateController.java:191 bindTemplate",
                "content": "java.lang.ArithmeticException: / by zero",
                "paramList": null
            }
        ],
        "stackList": [  // 堆栈调用信息
            "com.iceclean.siyuanpatch.controller.TemplateController.bindTemplate(TemplateController.java:191)",
            "com.iceclean.siyuanpatch.controller.TemplateController$$FastClassBySpringCGLIB$$a73a0280.invoke(<generated>)",
            "org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:218)",
            "org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:783)",
            "org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)",
            "org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:753)",
            "org.springframework.aop.aspectj.AspectJAfterThrowingAdvice.invoke(AspectJAfterThrowingAdvice.java:64)",
            "org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:175)",
            "org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.proceed(CglibAopProxy.java:753)"
        ]
    }
]


export {logdata}