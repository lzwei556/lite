import React from 'react';
import { Tabs as AntTabs, TabsProps } from 'antd';
import './style.css';

export const Tabs = (
  props: TabsProps & {
    noStyle?: boolean;
    tabListRef?: React.RefObject<HTMLDivElement>;
    tabsRighted?: boolean;
  }
) => {
  const { className, noStyle, tabListRef, tabsRighted, ...rest } = props;
  let newClassName = className;
  if (tabsRighted) {
    newClassName = newClassName ? `${newClassName} ant-tabs-righted` : `ant-tabs-righted`;
  }
  if (noStyle) {
    newClassName = newClassName
      ? `${newClassName} ant-tabs-content-no-style`
      : `ant-tabs-content-no-style`;
  }
  return (
    <AntTabs
      {...{ ...rest, className: newClassName }}
      renderTabBar={(props, Bar) => (
        <div ref={tabListRef} className='tabs-bar'>
          <Bar {...props} />
        </div>
      )}
    />
  );
};
