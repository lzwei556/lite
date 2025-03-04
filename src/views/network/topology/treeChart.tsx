import React from 'react';
import { CardProps, Card, Chart } from '../../../components';
import { truncate } from '../../../utils/format';
import { DeviceTreeNode } from '../../device/deviceTree';

export const TreeChart = ({
  treeData,
  height,
  onClick,
  ...rest
}: {
  treeData: DeviceTreeNode[];
  height: number;
  onClick?: (paras: any) => void;
} & CardProps) => {
  return (
    <Card {...rest} style={{ height: 'calc(100vh - 126px)', overflow: 'auto' }}>
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
                color: '#fff',
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
    </Card>
  );
};
