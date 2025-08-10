import React from 'react';
import { Collapse, CollapseProps } from 'antd';
import { useGlobalStyles } from '../../styles';

export const AnalysisSidebarCollapse = ({ items, ...rest }: CollapseProps) => {
  const { colorBgContainerStyle, colorBorderStyle } = useGlobalStyles();
  return (
    <Collapse
      {...rest}
      bordered={false}
      expandIconPosition='end'
      items={items?.map((item) => ({
        ...item,
        style: {
          marginBottom: 16,
          border: `solid 1px ${colorBorderStyle.color}`,
          borderRadius: 8,
          ...colorBgContainerStyle,
          ...item.style
        }
      }))}
      style={{ ...colorBgContainerStyle, ...rest.style }}
    />
  );
};
