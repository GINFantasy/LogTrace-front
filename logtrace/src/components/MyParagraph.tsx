import  { useRef, useState } from 'react';
import { Typography } from 'antd';
import { useMount } from '../utils/index';
import {getLineNumber} from '../utils/index'
import '../assets/styles/MyParagraph.scss'
interface TextProps {
  text: string;   // 内容
  rows: number;  // 最大行数
}
const { Paragraph } = Typography;
/**
 * @description: 封装带收起展开的段落
 * @param {TextProps} props
 * @return {*}
 * @author: GuluGuluu
 */
const MyParagraph = (props:TextProps) => {
  const [visible, setVisible] = useState(false);          
  const [ellipsisAble,setEllipsisAble] = useState(false); // 控制是否能展开
  const {text,rows} = props;
  const paragraphDom = useRef<HTMLDivElement | null>(null)
  useMount(()=>{
    let linenum = getLineNumber(paragraphDom.current,24);
    if( linenum > rows ){    // 行数大于所设值则展开按钮不可见
      setEllipsisAble(true)
    }
  })
  
  return (
    <div ref={paragraphDom} className='paragraph-ct'>
      <Paragraph
        ellipsis={visible ? false : {
          rows: rows,
          expandable: true,
          symbol: <div className='info-content-control' style={{ visibility:'hidden' }}>
            <span onClick={() => setVisible(true)}>展开</span>
          </div>}
        }
        className='info-content'
      >
        {text}
        {visible && <div className='info-content-control'><span onClick={() => setVisible(false)}>收起</span></div>}
      </Paragraph>
      {!visible && (
        <div className='info-content-control' style={{ display:ellipsisAble?'block':'none' }}>
          <span onClick={() => setVisible(true)}>展开</span>
        </div>
       )}
    </div>
  )
};

export default MyParagraph;