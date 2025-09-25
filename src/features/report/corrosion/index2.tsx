import React from 'react';
import { Button, Typography } from 'antd';
import { Card, Descriptions, Flex } from '../../../components';
import { Dayjs, getValue, toMac } from '../../../utils';
import { getReportType } from '../utils';
import { useTypeContext } from '../context';
import { Report, ReportDevice } from '../types';
import { DeviceEvalLevel, getDeviceEvalReason, MonitoringPointEvalLevel } from '../constants';
import { PieChart } from './device';
import { ReportTable } from '../table';
import intl from 'react-intl-universal';

export const Index2 = ({ report }: { report: Report }) => {
  const duration = `${Dayjs.format(report.start, 'YYYY/MM/DD')}-${Dayjs.format(
    report.end,
    'YYYY/MM/DD'
  )}`;
  const { devicesList, devicesStatistics } = useDeviceStatus(report);
  const { monitoringPoints, monitoringStatusStatistics } = useMonitoringPoints(report);
  const cardRef = React.createRef<HTMLDivElement>();

  return (
    <Flex justify='center'>
      <Card
        ref={cardRef}
        style={{ width: '210mm', height: 'auto' }}
        styles={{ body: { paddingBlock: 24, paddingInline: 32 } }}
        extra={
          <Button
            onClick={() => {
              if (cardRef.current) {
                // html2pdf(cardRef.current);
              }
            }}
          >
            download
          </Button>
        }
      >
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Typography.Title level={3}>{useTitle()}</Typography.Title>
          <Typography.Text type='secondary'>{duration}</Typography.Text>
        </div>
        <section style={{ marginBottom: 32 }}>
          <div style={{ borderBottom: 'solid 1px', marginBottom: 16 }}>
            <Typography.Title level={4}>基本信息</Typography.Title>
          </div>
          <Descriptions
            contentStyle={{ justifyContent: 'flex-start' }}
            items={[
              { label: '项目名称', children: report.reportName },
              { label: '监测方法', children: '超声波测厚' },
              { label: '报告周期', children: duration },
              { label: '生成日期', children: Dayjs.format(report.reportDate, 'YYYY/MM/DD') }
            ]}
          />
        </section>
        <section style={{ marginBottom: 32 }}>
          <div style={{ borderBottom: 'solid 1px', marginBottom: 16 }}>
            <Typography.Title level={4}>设备状态</Typography.Title>
          </div>
          <PieChart statistics={devicesStatistics} />
          <Typography.Paragraph style={{ fontSize: 16, textAlign: 'center' }}>
            异常设备
          </Typography.Paragraph>
          <ReportTable
            columns={[
              {
                key: 'mac',
                dataIndex: 'mac',
                title: 'MAC地址',
                width: 150,
                render: (mac: string) => (
                  <span style={{ display: 'inline-block', minHeight: 34, lineHeight: '34px' }}>
                    {toMac(mac.toUpperCase())}
                  </span>
                )
              },
              { key: 'typeName', dataIndex: 'typeName', title: '设备类型', width: 80 },
              { key: 'batteryVoltage', dataIndex: 'batteryVoltage', title: '电池电压', width: 80 },
              {
                key: 'signalQuality',
                dataIndex: 'signalQuality',
                title: '信号强度',
                width: 80,
                render: (value: number) => getValue({ value, precision: 1 })
              },
              {
                key: 'signalStrength',
                dataIndex: 'signalStrength',
                title: '信号质量',
                width: 80,
                render: (value: number) => getValue({ value, precision: 1 })
              },
              {
                key: 'evaluationReasons',
                dataIndex: 'evaluationReasons',
                title: '状态',
                render: (reasons: number[], d: ReportDevice) => {
                  return intl.get(getDeviceEvalReason(d.evaluationLevel, reasons));
                }
              }
            ]}
            dataSource={devicesList}
            showHeader={true}
          />
        </section>
        <section style={{ marginBottom: 32 }}>
          <div style={{ borderBottom: 'solid 1px', marginBottom: 16 }}>
            <Typography.Title level={4}>监测点概况</Typography.Title>
          </div>
          <ReportTable
            columns={[
              { key: 'index', dataIndex: 'indexName', title: '序号', width: 50 },
              {
                key: 'name',
                dataIndex: 'name',
                title: '名称',
                // width: 160,
                render: (value: string) => (
                  <span
                    style={{
                      display: 'inline-block',
                      minHeight: 34,
                      minWidth: 180,
                      lineHeight: '34px'
                    }}
                  >
                    {value}
                  </span>
                )
              },
              {
                key: 'initialThickness',
                dataIndex: 'initialThickness',
                title: '初始厚度',
                width: 55,
                render: (value: number) => getValue({ value, precision: 3 })
              },
              {
                key: 'criticalThickness',
                dataIndex: 'criticalThickness',
                title: '临界厚度',
                width: 55,
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
        </section>
      </Card>
    </Flex>
  );
};

const useTitle = () => {
  const { type } = useTypeContext();
  return `腐蚀测厚${getReportType(type)}报`;
};

const useDeviceStatus = (report: Report) => {
  const { devices } = report;
  const devicesList = devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error);
  const devicesStatistics = [
    devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Normal).length,
    devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error).length
  ];
  return { devicesList, devicesStatistics };
};

const useMonitoringPoints = (report: Report) => {
  const { monitoringPoints } = report;
  const monitoringStatusStatistics = [
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Normal).length,
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Minor).length,
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Major).length,
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Critical).length
  ];
  return { monitoringPoints, monitoringStatusStatistics };
};
