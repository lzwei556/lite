import React from 'react';
import { Space } from 'antd';
import {
  getMonitoringPointEvalLevel,
  getMonitoringPointEvalLevelColor,
  getMonitoringPoints
} from './common';
import { PieChart } from '../../components/pie-chart';
import { ReportTable } from '../../components/table';
import { Report, ReportMonitoringPoint } from '../../types';
import { getValue } from '../../../../utils';
import { getReportType } from '../../utils';
import { getDurationByDays } from '../../../corrosion-analysis/useAnalysis';
import intl from 'react-intl-universal';
import { ReportSection } from '../../components/section';

export const MonitoringPointsStatusSection = ({
  report,
  type
}: {
  report: Report;
  type: number;
}) => {
  const { monitoringPoints, monitoringStatusStatistics } = getMonitoringPoints(report);

  return (
    <ReportSection title='监测点状态'>
      <PieChart statistics={monitoringStatusStatistics} />
      <ReportTable
        columns={[
          { key: 'index', dataIndex: 'indexName', title: '序号', width: 50 },
          {
            key: 'name',
            dataIndex: 'name',
            title: '名称',
            // width: 160,
            render: (value: string) => <Space style={{ minHeight: 32 }}>{value}</Space>
          },
          {
            key: 'assetName',
            dataIndex: 'assetName',
            title: '资产',
            render: (value: string) => <Space style={{ minHeight: 32 }}>{value}</Space>
          },
          {
            key: 'thickness',
            title: '厚度（mm）',
            width: 110,
            render: (_: string, m: ReportMonitoringPoint) => {
              return (
                <>
                  <div>{`当前 ${getValue({ value: m.thicknessNew, precision: 3 })}`}</div>
                  <div>{`上${getReportType(type)} ${getValue({
                    value: m.thicknessLast,
                    precision: 3
                  })}`}</div>
                </>
              );
            }
          },
          {
            key: 'thickness_delta',
            dataIndex: 'thicknessDelta',
            title: '减薄量（mm）',
            width: 75,
            render: (value: number) => getValue({ value, precision: 3 })
          },
          {
            key: 'corrosion_rate',
            dataIndex: 'corrosionRate',
            title: '腐蚀速率（mm/a）',
            width: 80,
            render: (value: number) => getValue({ value, precision: 3 })
          },
          {
            key: 'residual_life',
            dataIndex: 'residualLife',
            title: '剩余寿命',
            width: 75,
            render: (value: number) => {
              const duration = getDurationByDays(value);
              return `${duration.duration} ${intl.get(duration.unit).d(duration.unit)}`;
            }
          },
          {
            key: 'evaluationLevel',
            dataIndex: 'evaluationLevel',
            title: '状态',
            width: 70,
            render: (level: number) => (
              <span style={{ color: getMonitoringPointEvalLevelColor(level) }}>
                {intl.get(getMonitoringPointEvalLevel(level))}
              </span>
            )
          }
        ]}
        dataSource={monitoringPoints}
        showHeader={true}
      />
    </ReportSection>
  );
};
