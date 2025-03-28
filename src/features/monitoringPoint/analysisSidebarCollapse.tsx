import React from 'react';
import { Collapse, CollapseProps } from 'antd';

export const AnalysisSidebarCollapse = ({ items }: { items: CollapseProps['items'] }) => {
  return (
    <Collapse
      accordion={true}
      bordered={false}
      defaultActiveKey='overview'
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
