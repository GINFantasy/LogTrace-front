import { Select } from "antd";
const { Option } = Select;
interface SelectPropsType {
  optionsList: string[];
  title: string;
  className?: string;
  handleSelect: Function;
}
/**
 * @description: 封装带标题选择器
 * @param {SelectPropsType} props
 * @return {*}
 * @author: GuluGuluu
 */
export default function MySelect(props: SelectPropsType) {
  const { optionsList, title, className, handleSelect } = props;
  const handleChange = (value: string) => {
    handleSelect(value);
  };
  return (
    <div className={`select-box ${className}`}>
      <span>{title}：</span>
      <Select defaultValue="ALL" style={{ width: 120 }} onChange={handleChange}>
        {optionsList.map((v, i) => (
          <Option key={i} value={v}>
            {v}
          </Option>
        ))}
      </Select>
    </div>
  );
}
