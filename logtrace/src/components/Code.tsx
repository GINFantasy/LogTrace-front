 // @ts-nocheck
import { useEffect,useRef } from "react";
import { CodeObj } from "custom_types/Log";
import * as monaco from 'monaco-editor';
import { IStandaloneThemeData,IMonarchLanguage  } from "custom_types/Log";
import monarchObj from "../data/Monarch";
import '../assets/styles/Code.scss'

export default function Code(props:{codeObj:CodeObj}){
    const editorRef = useRef<HTMLDivElement>(null);
    let editorIns = useRef('');
    const {codeObj} = props;

    useEffect(() => {
        if (editorRef.current) {
            // @ts-ignore
            editorIns.current = monaco.editor.create(editorRef.current, {
                language: 'java',
                value:'// 暂无',
                folding: true,
                readOnly:true,
                theme: 'vs-dark',
                minimap:{
                    enabled:false
                },
                scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                },
                formatOnPaste: true,
                renderValidationDecorations: 'on',
            });
        }
        // 修改主题
        import('monaco-themes/themes/Night Owl.json')
        .then((data) => {
            monaco.editor.defineTheme('theme', data as IStandaloneThemeData);
            monaco.editor.setTheme('theme')
        })
        monaco.languages.setMonarchTokensProvider('log', monarchObj as IMonarchLanguage );
    }, [editorRef]);
    
    useEffect(()=>{
        const {code,line} = codeObj
        
        if(code && code !== ''){
            const model = editorIns.current.getModel();
            editorIns.current.setValue(code);
            // 定位到指定行
            editorIns.current.revealLineInCenter(line)
            // 标记错误
            monaco.editor.setModelMarkers(model,'java',[{ // json为语言类型
                startLineNumber: line,
                endLineNumber: line,
                startColumn: 1,
                // 获取代码最后列数
                endColumn: model.getLineMaxColumn(line),
                severity: monaco.MarkerSeverity.Error,
                message: `语法错误`,
            }])
        }else{
            editorIns.current.setValue(`// 非本项目代码`);
        }
    },[codeObj])

    return <div className="code-ct" ref={editorRef}></div>;
}