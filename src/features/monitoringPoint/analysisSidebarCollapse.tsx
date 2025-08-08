import React from 'react';
import { Collapse, CollapseProps } from 'antd';

export const AnalysisSidebarCollapse = ({ items, ...rest }: CollapseProps) => {
  return (
    <Collapse
      {...rest}
      bordered={false}
      expandIconPosition='end'
      items={items?.map((item) => ({
        ...item,
        style: {
          marginBottom: 16,
          border: 'solid 1px #f0f0f0',
          borderRadius: 8,
          backgroundColor: '#fff',
          ...item.style
        }
      }))}
      style={{ backgroundColor: '#fff', ...rest.style }}
    />
  );
};
