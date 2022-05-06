import  { useState } from 'react';
import { Typography } from 'antd';
import {getLineNumber} from '../utils/index'
interface TextProps {
  text: string;
  rows?: number;
}
const { Paragraph } = Typography;
const MyParagraph = (props:TextProps) => {
  const [visible, setVisible] = useState(false);
  const {text,rows} = props;
  //console.log(getLineNumber());
  
  return (
    <div style={{ position: 'relative' }}>
      <Paragraph
        ellipsis={visible ? false : {
          rows: rows,
          expandable: true,
          symbol: <div style={{ position: 'absolute', bottom: 0, right: 0,visibility:'hidden' }}>
          <span className='info-content-control' onClick={() => setVisible(true)}>展开</span>
        </div>}
         }
         className='info-content'
       >
        {text}
        {visible && <span className='info-content-control' onClick={() => setVisible(false)}>收起</span>}
      </Paragraph>
      {!visible && (
        <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <span className='info-content-control asd' onClick={() => setVisible(true)}>展开</span>
        </div>
       )}
    </div>
  )
};

export default MyParagraph;