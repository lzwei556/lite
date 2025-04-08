import React from 'react';
import { Collapse, CollapseProps } from 'antd';

export const AnalysisSidebarCollapse = ({ items, ...rest }: CollapseProps) => {
  return (
    <Collapse
      {...rest}
      accordion={true}
      bordered={false}
      expandIconPosition='end'
      items={items?.map((item) => ({
        ...item,
        style: {
          marginBottom: 16,
          border: 'solid 1px #d3d3d3',
          backgroundColor: '#fff',
          ...item.style
        },
        styles: {
          header: item.styles?.header,
          body: { padding: 0, ...item.styles?.body }
        }
      }))}
    />
  );
};
