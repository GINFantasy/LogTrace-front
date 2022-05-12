const LEVEL = ['ALL','INFO','ERROR','WARN','DEBUG'];
const TYPE = ['ALL','SYSTEM','OTHER']; 

const testclass = `//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.iceclean.siyuanpatch.service.Impl;

import com.iceclean.siyuanpatch.builder.AttributeBuilder;
import com.iceclean.siyuanpatch.builder.DialogBuilder;
import com.iceclean.siyuanpatch.builder.TemplateBuilder;
import com.iceclean.siyuanpatch.config.SystemConfig;
import com.iceclean.siyuanpatch.constants.SystemConstants;
import com.iceclean.siyuanpatch.constants.TemplateConstants;
import com.iceclean.siyuanpatch.service.SiYuanService;
import com.iceclean.siyuanpatch.service.TemplateService;
import com.iceclean.siyuanpatch.utils.DateUtils;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import top.iceclean.logtrace.annotation.EnableLogTrace;
import top.iceclean.logtrace.annotation.LogMessage;
import top.iceclean.logtrace.bean.LogTrace;
import top.iceclean.logtrace.bean.Logger;
import top.iceclean.logtrace.config.LogTraceConfig;

@Service
@EnableLogTrace
public class TemplateServiceImpl implements TemplateService {
    @Autowired
    SiYuanService siYuanService;
    @Autowired
    SystemConfig systemConfig;
    Logger logTrace;
    @Lazy
    @Autowired
    private TemplateService self;

    public AttributeBuilder bindBlockOfInt(String targetId, String operationId) {
        LogTrace logTrace = LogTrace.getLogTrace();
        AttributeBuilder builder = new AttributeBuilder();
        String operationName = "operation" + UUID.randomUUID().toString().split("-")[0];
        if (operationId == null) {
            builder.addAttribute("onclick", operationName + " = button.innerText.split('：')[1]");
        } else {
            builder.setAttribute("onclick").addAttributes(new String[]{"target_" + operationName + " = " + operationId}).addAttributes(new String[]{"block_" + operationName + " = document.querySelector('div[data-node-id=\\'' + target_" + operationName + " + '\\']')"}).addAttributes(new String[]{operationName + " = block_" + operationName + ".innerText"});
        }

        builder.setAttribute("onclick").addAttributes(new String[]{"url='" + SystemConstants.UPDATE_INT + "?id=" + targetId + "&operation=' + " + operationName}).addAttributes(new String[]{"url=url.replace(reg, '')"}).addAttributes(new String[]{"xhr.open('GET', url, true)", "xhr.send(null)"});
        return builder;
    }

    public void bindBlockOfInt(String blockId, String targetId, String operationId, boolean append) {
        LogTrace logTrace = LogTrace.getLogTrace();
        String onclickNumAttr = this.siYuanService.getAttribute(blockId, "custom-onclickNum");
        int onclickNum = onclickNumAttr == null ? 1 : Integer.parseInt(onclickNumAttr) + 1;
        this.siYuanService.setAttribute(blockId, "custom-onclickNum", "" + onclickNum);
        logTrace.info("为块 [%s] 绑定第 %d 个监听事件", new Object[]{blockId, onclickNum});
        String operationName = "operation" + onclickNum;
        String operationString;
        if (operationId == null) {
            operationString = "(" + operationName + "=button.innerText.split('：')[1]);";
        } else {
            operationString = "(block_" + operationName + "=document.querySelector('div[data-node-id=\\'" + operationId + "\\']')); (" + operationName + "=block_" + operationName + ".innerText);";
        }

        String beforeOnClick = this.siYuanService.getAttribute(blockId, "onclick");
        String onClick;
        if (append && beforeOnClick != null) {
            onClick = beforeOnClick + operationString + "(url='" + SystemConstants.UPDATE_INT + "?id=" + targetId + "&operation=' + " + operationName + "); (url=url.replace(reg, '')); xhr.open('GET', url, true); xhr.send(null);";
        } else {
            onClick = "javascript: (xhr=new XMLHttpRequest()); (button=document.querySelector('div[data-node-id=\\'" + blockId + "\\']')); " + operationString + "(reg = new RegExp('amp;', 'g')); (url='" + SystemConstants.UPDATE_INT + "?id=" + targetId + "&operation=' + " + operationName + "); (url=url.replace(reg, '')); xhr.open('GET', url, true); xhr.send(null); ";
        }

        this.siYuanService.setAttribute(blockId, "onclick", onClick);
        this.siYuanService.setAttribute(blockId, "style", TemplateConstants.BUTTON_BLOCK_ATTRIBUTE.getStyle());
    }

    public AttributeBuilder bindTemplate(String targetId, String kindId, String extraIdStrings) {
        LogTrace logTrace = LogTrace.getLogTrace();
        AttributeBuilder builder = new AttributeBuilder();
        if (targetId == null) {
            builder.addAttribute("custom-template-id", kindId.split("：")[1]);
        } else {
            this.siYuanService.setAttribute(targetId, "custom-template-id", kindId.split("：")[1]);
        }

        String extraIdName = "extraId" + UUID.randomUUID().toString().split("-")[0];
        if (extraIdStrings != null) {
            String[] extraIds = extraIdStrings.split(",");
            builder.addAttribute("onclick", "array_" + extraIdName + " = new Array(" + extraIds.length + ")");

            for(int i = 0; i < extraIds.length; ++i) {
                builder.addAttribute("onclick", "array_" + extraIdName + "[" + i + "] = " + extraIds[i]);
            }
        } else {
            builder.addAttribute("onclick", "array_" + extraIdName + " = null");
        }

        builder.setAttribute("onclick").addAttributes(new String[]{"url = '" + SystemConstants.ADD_TEMPLATE_CONTENT + "?blockId=" + (targetId != null ? targetId : "' + blockId + '") + "&extraIds=' + array_" + extraIdName}).addAttributes(new String[]{"url=url.replace(reg, '')"}).addAttributes(new String[]{"xhr.open('GET', url, true)", "xhr.send(null)"});
        return builder;
    }

    public void bindTemplate(String blockId, String targetId, String kindId, String extraIds, boolean append) throws Exception {
        LogTrace logTrace = LogTrace.getLogTrace();
        this.siYuanService.setAttribute(blockId, "custom-template-id", kindId.split("：")[1]);
        if (targetId != null) {
            this.siYuanService.setAttribute(targetId, "custom-template-id", kindId.split("：")[1]);
        }

        String beforeOnClick = this.siYuanService.getAttribute(blockId, "onclick");
        String onClick;
        if (append && beforeOnClick != null) {
            onClick = beforeOnClick + "(url='" + SystemConstants.ADD_TEMPLATE_CONTENT + "?blockId=" + (targetId != null ? targetId : blockId) + "&extraIds=" + extraIds + "'); (url=url.replace(reg, '')); xhr.open('GET', url, true); xhr.send(null); ";
        } else {
            onClick = "javascript: (xhr=new XMLHttpRequest()); (reg = new RegExp('amp;', 'g')); (url='" + SystemConstants.ADD_TEMPLATE_CONTENT + "?blockId=" + (targetId != null ? targetId : blockId) + "&extraIds=" + extraIds + "'); (url=url.replace(reg, '')); xhr.open('GET', url, true); xhr.send(null); ";
        }

        this.siYuanService.setAttribute(blockId, "onclick", onClick);
        this.siYuanService.setAttribute(blockId, "style", TemplateConstants.BUTTON_BLOCK_ATTRIBUTE.getStyle());
    }

    public void updateInt(String targetId, Integer operation) {
        LogTrace logTrace = LogTrace.getLogTrace();
        logTrace.info("为块 [%s] 执行修改 [%d]", new Object[]{targetId, operation});
        String blockValueString = this.siYuanService.getBlockValue(targetId);

        try {
            Integer blockValue = Integer.parseInt(blockValueString);
            blockValue = blockValue + operation;
            this.siYuanService.updateBlock(targetId, "" + blockValue);
        } catch (NumberFormatException var6) {
            logTrace.error("更新失败，该块值非整型，而是 [%s]", new Object[]{blockValueString});
        }

    }

    public void addTemplateContent(String blockId, String extraIds) {
        LogTrace logTrace = LogTrace.getLogTrace();
        String templateIdAttr = this.siYuanService.getAttribute(blockId, "custom-template-id");
        if (templateIdAttr != null) {
            String[] templateIds = templateIdAttr.split("; ");
            String[] var6 = templateIds;
            int var7 = templateIds.length;

            for(int var8 = 0; var8 < var7; ++var8) {
                String templateId = var6[var8];
                byte var11 = -1;
                switch(templateId.hashCode()) {
                case 48626:
                    if (templateId.equals("101")) {
                        var11 = 0;
                    }
                    break;
                case 48627:
                    if (templateId.equals("102")) {
                        var11 = 1;
                    }
                    break;
                case 1507424:
                    if (templateId.equals("1001")) {
                        var11 = 2;
                    }
                    break;
                case 1507425:
                    if (templateId.equals("1002")) {
                        var11 = 3;
                    }
                }

                switch(var11) {
                case 0:
                    this.bindTravelLogTemplate(blockId, extraIds);
                    break;
                case 1:
                    this.bindTaskDialogTemplate(blockId, extraIds);
                    break;
                case 2:
                    this.bindTaskTemplate(blockId);
                    break;
                case 3:
                    this.bindDailyTemplate(blockId);
                }
            }
        } else {
            logTrace.error("模板按钮 [%s] 对应的模板 id 找不到", new Object[]{blockId});
        }

    }

    public void bindTaskTemplate(String blockId) {
        LogTrace logTrace = LogTrace.getLogTrace();
        TemplateBuilder taskTemplateBuilder = (new TemplateBuilder()).addBeginBlock().addInlineText("" + DateUtils.getHourMinute(), "time").setMomo("时间范围").addAttribute(TemplateConstants.INPUT_BLOCK_ATTRIBUTE).setWidth("160px").addInlineText((String)null, "content").setMomo("任务内容").addAttribute(TemplateConstants.INPUT_BLOCK_ATTRIBUTE).addAttribute("style", "width: 100%").addInlineText((String)null, "exp").setMomo("经验").addAttribute(TemplateConstants.INPUT_BLOCK_ATTRIBUTE).setWidth("50px").addInlineText((String)null, "gold").setMomo("金币").addAttribute(TemplateConstants.INPUT_BLOCK_ATTRIBUTE).setWidth("50px").addButton("完成任务", "finish").addAttribute("style", "min-width: 70px").addEndBlock("taskList").addAttribute("style", "display: flex").addAttribute("style", "padding-top: 0.8em");
        String timeId = taskTemplateBuilder.getIdString("time");
        String contentId = taskTemplateBuilder.getIdString("content");
        String expId = taskTemplateBuilder.getIdString("exp");
        String goldId = taskTemplateBuilder.getIdString("gold");
        taskTemplateBuilder.getAttributeBuilder("finish").addAttribute(this.bindBlockOfInt(this.systemConfig.walletId, goldId)).addAttribute(this.bindBlockOfInt(this.systemConfig.expId, expId));
        String extraIdStrings = timeId + "," + contentId + "," + expId + "," + goldId;
        taskTemplateBuilder.getAttributeBuilder("finish").addAttribute(this.bindTemplate(this.systemConfig.dailyTravelLogId, "KIND：101", extraIdStrings)).addAttribute(this.bindTemplate((String)null, "KIND：102", extraIdStrings));
        List<String> blockIdList = this.siYuanService.insertBlock(blockId, 1, taskTemplateBuilder.build());
        if (blockIdList.size() != taskTemplateBuilder.getBlockNum()) {
            logTrace.error("绑定任务模板失败，块的数量不对：%d != %d", new Object[]{blockIdList.size(), taskTemplateBuilder.getBlockNum()});
        } else {
            String finishId = (String)blockIdList.get(taskTemplateBuilder.getIndex("finish"));
            AttributeBuilder builder = taskTemplateBuilder.getAttributeBuilder("finish");
            Iterator var12 = builder.getAttributeMap().keySet().iterator();

            while(var12.hasNext()) {
                String attrName = (String)var12.next();
                this.siYuanService.setAttribute(finishId, attrName, builder.getAttribute(attrName));
            }

        }
    }

    public void bindDailyTemplate(String blockId) {
        LogTrace logTrace = LogTrace.getLogTrace();
        TemplateBuilder dailyBuilder = (new TemplateBuilder()).addBeginBlock().addBlockText("#### \ud83d\udcdd" + DateUtils.getTime()).addBeginBlock().addBlockText("**总体安排**").addBlockText((String)null).addEndBlock().addAttribute("style", "padding-left: 1.5em").addBeginBlock().addButton("添加任务", "addTask").addAttribute(this.bindTemplate((String)null, "KIND：1001", (String)null)).addEndBlock().addAttribute("style", "padding-left: 1.5em").addEndBlock().addAttribute(TemplateConstants.CITE_BLOCK_ATTRIBUTE);
        List<String> blockIdList = this.siYuanService.insertBlock(blockId, 0, dailyBuilder.build());
        if (blockIdList.size() != dailyBuilder.getBlockNum()) {
            logTrace.error("绑定日程模板失败，块的数量不对：%d != %d", new Object[]{blockIdList.size(), dailyBuilder.getBlockNum()});
        } else {
            String finishId = (String)blockIdList.get(dailyBuilder.getIndex("addTask"));
            AttributeBuilder builder = dailyBuilder.getAttributeBuilder("addTask");
            Iterator var7 = builder.getAttributeMap().keySet().iterator();

            while(var7.hasNext()) {
                String attrName = (String)var7.next();
                this.siYuanService.setAttribute(finishId, attrName, builder.getAttribute(attrName));
            }

        }
    }

    public void bindTravelLogTemplate(String blockId, String extraIds) {
        LogTrace logTrace = LogTrace.getLogTrace();
        String[] extraIdArray = extraIds.split(",");
        String detail = "计划：" + this.siYuanService.getBlockValue(extraIdArray[0]) + "\n经验：" + this.siYuanService.getBlockValue(extraIdArray[2]) + "，金币：" + this.siYuanService.getBlockValue(extraIdArray[3]);
        TemplateBuilder builder = (new TemplateBuilder()).addBeginBlock().addBeginBlock().addInlineText(this.siYuanService.getBlockValue(extraIdArray[1])).setWidth("100%").addInlineText(DateUtils.getHourMinute()).setWidth("5em").addAttribute("style", "text-align: right").addEndBlock().addAttribute("style", "display: flex").addBlockText(detail).addAttribute("style", "border-top: 1px solid #888888").addEndBlock().addAttribute(TemplateConstants.CITE_BLOCK_ATTRIBUTE);
        List<String> blockIdList = this.siYuanService.insertBlock(blockId, 0, builder.build());
        if (blockIdList.size() != builder.getBlockNum()) {
            logTrace.error("绑定旅行记录模板失败，块的数量不对：%d != %d", new Object[]{blockIdList.size(), builder.getBlockNum()});
        }

    }

    public void bindDevelopmentQuestionTemplate() {
        LogTrace logTrace = LogTrace.getLogTrace();
        TemplateBuilder builder = (new TemplateBuilder()).addBeginBlock().addBlockText("#### \ud83d\udcdd" + DateUtils.getTime()).addEndBlock().addAttribute(TemplateConstants.CITE_BLOCK_ATTRIBUTE);
    }

    public void bindTaskDialogTemplate(String blockId, String extraIds) {
        LogTrace logTrace = LogTrace.getLogTrace();
        String[] extraIdArray = extraIds.split(",");
        DialogBuilder taskDialogTemplateBuilder = (new DialogBuilder()).setTitle("完成任务").addItem("任务内容", this.siYuanService.getBlockValue(extraIdArray[1])).addItem("任务收获", "经验：" + this.siYuanService.getBlockValue(extraIdArray[2]) + "，金币：" + this.siYuanService.getBlockValue(extraIdArray[3])).setButton("确定");
        List<String> blockIdList = this.siYuanService.insertBlock(blockId, 0, taskDialogTemplateBuilder.build());
        if (blockIdList.size() != 9) {
            logTrace.error("绑定对话框模板失败，块的数量不对，为：" + blockIdList.size());
        } else {
            this.siYuanService.setAttribute((String)blockIdList.get(8), "onclick", taskDialogTemplateBuilder.getAttribute(3, "onclick"));
        }
    }

    public void test2(int number) {
        LogTrace logTrace = LogTrace.getLogTrace();
        logTrace.info("我是 test2");
        this.test3();
    }

    @LogMessage(
        mode = "RECORD",
        type = "LOG",
        value = "测试日志"
    )
    public String test3() {
        LogTrace logTrace = LogTrace.getLogTrace();
        logTrace.info("我是 test3");
        return LogTraceConfig.datasourceInfo;
    }

    public TemplateServiceImpl() {
        LogTrace logTrace = LogTrace.getLogTrace();
        System.out.println("对象被创建");
    }
}
`
export {LEVEL,TYPE,testclass}