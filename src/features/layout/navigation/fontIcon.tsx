import './iconfont.css';

export const FontIcon = ({ classNames }: { classNames: string[] }) => {
  return <span className={`iconfont ${classNames.join(' ')}`} />;
};
