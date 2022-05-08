import { Spin } from "antd";
/**
 * @description: 封装antd loading框
 * @param {object} props 类名 加载控制参数 提示语
 * @return {*}
 * @author: GuluGuluu
 */
export default function LoadingCover(props: {
  className?: string;
  loading: boolean;
  tip: string;
}) {
  let { className, loading, tip } = props;
  if (!className) className = "";
  return (
    <div
      className={`spin-cover ${
        loading ? "" : "spin-cover-hidden"
      } ${className}`}
    >
      <Spin spinning={true} tip={tip}></Spin>
    </div>
  );
}
