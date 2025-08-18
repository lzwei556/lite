import React from 'react';
import { Chart } from '../../components';
import { truncate } from '../../utils/format';
import { DeviceTreeNode } from '../../features/device/deviceTree';
import { useGlobalStyles } from '../../styles';

export const TreeChart = ({
  treeData,
  height,
  onClick
}: {
  treeData: DeviceTreeNode[];
  height: number;
  onClick?: (paras: any) => void;
}) => {
  const { colorBgContainerStyle } = useGlobalStyles();
  return (
    <Chart
      onEvents={onClick ? { click: onClick } : undefined}
      options={{
        animation: false,
        series: [
          {
            top: 50,
            type: 'tree',
            data: treeData,
            edgeShape: 'polyline',
            label: {
              verticalAlign: 'middle',
              formatter: ({ name, value }) => {
                return `{name|${truncate(name, 12)}}\n{mac|${value}}`;
              },
              color: colorBgContainerStyle.backgroundColor,
              borderRadius: 4,
              rich: {
                name: { padding: 8, align: 'center', fontSize: 14 },
                mac: { padding: [0, 8, 8, 8], align: 'center', width: 130 }
              }
            },
            leaves: {
              label: {
                verticalAlign: 'middle'
              }
            },
            initialTreeDepth: -1,
            expandAndCollapse: false
          }
        ],
        tooltip: { formatter: '{b}' }
      }}
      style={{ height }}
    />
  );
};
