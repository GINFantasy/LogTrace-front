import { Select } from "antd"
const { Option } = Select;
interface SelectPropsType{
    optionsList:string[],
    title:string,
    className?:string,
    handleSelect:Function
}

function handleChange(value:string) {
    console.log(`selected ${value}`);
}

export default function MySelect(props:SelectPropsType){
    const {optionsList,title,className} = props
    
    return <div className={`select-box ${className}`}>
        <span>{title}：</span>
        <Select defaultValue='ALL' style={{ width: 120 }} onChange={handleChange}>
            {
                optionsList.map((v,i)=><Option key={i} value={v}>{v}</Option>)
            }
        </Select>
    </div>
}