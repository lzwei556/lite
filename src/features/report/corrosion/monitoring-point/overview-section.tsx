import React from 'react';
import { Space } from 'antd';
import { ReportTable } from '../../components/table';
import { getValue } from '../../../../utils';
import { getMonitoringPoints } from './common';
import { Report } from '../../types';
import { ReportSection } from '../../components/section';

export const MonitoringPointsOverviewSection = ({ report }: { report: Report }) => {
  const { monitoringPoints } = getMonitoringPoints(report);

  return (
    <ReportSection title='监测点概况'>
      <ReportTable
        columns={[
          { key: 'index', dataIndex: 'indexName', title: '序号', width: 50 },
          {
            key: 'name',
            dataIndex: 'name',
            title: '名称',
            render: (value: string) => <Space style={{ minHeight: 32 }}>{value}</Space>
          },
          {
            key: 'assetName',
            dataIndex: 'assetName',
            title: '资产',
            render: (value: string) => <Space style={{ minHeight: 32 }}>{value}</Space>
          },
          {
            key: 'initialThickness',
            dataIndex: 'initialThickness',
            title: '初始厚度（mm）',
            width: 80,
            render: (value: number) => getValue({ value, precision: 3 })
          },
          {
            key: 'criticalThickness',
            dataIndex: 'criticalThickness',
            title: '临界厚度（mm）',
            width: 80,
            render: (value: number) => getValue({ value, precision: 3 })
          },
          {
            key: 'conditions',
            dataIndex: 'conditions',
            title: '报警条件',
            render: (conditions: string[]) => conditions.join(' ')
          }
        ]}
        dataSource={monitoringPoints}
        showHeader={true}
      />
    </ReportSection>
  );
};
