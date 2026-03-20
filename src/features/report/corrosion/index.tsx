import React from 'react';
import { Typography } from 'antd';
import { Descriptions } from '../../../components';
import { Dayjs } from '../../../utils';
import { getReportType } from '../utils';
import { useTypeContext } from '../context';
import { Report } from '../types';
import { ReportType } from '../constants';
import { DevicesStatusSection } from './device/status-section';
import { MonitoringPointsOverviewSection } from './monitoring-point/overview-section';
import { MonitoringPointsStatusSection } from './monitoring-point/status-section';
import { MonitoringPointConclusion } from './monitoring-point/conclusion';
import { AlarmRecordsSection } from './alarm';
import { DevicesConclusion } from './device/conclusion';
import { ReportSection } from '../components/section';
import { ReportContainer } from '../components/report-container';

export const Index = ({ report }: { report: Report }) => {
  const duration = `${Dayjs.format(report.start, 'LL')} - ${Dayjs.format(report.end, 'LL')}`;
  const alarmRecords = getAlarmRecords(report);
  const { type } = useTypeContext();
  const title = getTitle(type);

  return (
    <ReportContainer filename=''>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Typography.Title level={3}>{title}</Typography.Title>
        <Typography.Text type='secondary'>{duration}</Typography.Text>
      </div>
      <ReportSection title='基本信息'>
        <Descriptions
          contentStyle={{ justifyContent: 'flex-start', textIndent: '2em' }}
          items={[
            { label: '项目名称', children: report.reportName },
            { label: '监测方法', children: '超声波测厚' },
            { label: '报告周期', children: duration },
            { label: '生成日期', children: Dayjs.format(report.reportDate, 'LL') }
          ]}
        />
      </ReportSection>
      <DevicesStatusSection report={report} />
      <MonitoringPointsOverviewSection report={report} />
      <MonitoringPointsStatusSection report={report} type={type} />
      {alarmRecords && alarmRecords.length > 0 && (
        <AlarmRecordsSection alarmRecords={alarmRecords} />
      )}
      <ReportSection title='结论与建议'>
        <ul style={{ lineHeight: 2 }}>
          <MonitoringPointConclusion monitoringPoints={report.monitoringPoints} />
          <DevicesConclusion devices={report.devices} />
          {alarmRecords && alarmRecords.length > 0 && (
            <li>
              存在 <span className='value'>{alarmRecords.length}</span> 条未处理报警记录，请及时处理
            </li>
          )}
        </ul>
      </ReportSection>
    </ReportContainer>
  );
};

const getTitle = (type: ReportType) => {
  return `腐蚀测厚${getReportType(type)}报`;
};

const getAlarmRecords = (report: Report) => {
  return (report.alarmRecords ?? []).filter((r: any) => r.status === 0);
};
