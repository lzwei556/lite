import React from 'react';
import { Button, Typography } from 'antd';
import { Card, Descriptions, Flex } from '../../../components';
import { Dayjs, getValue, toMac } from '../../../utils';
import { getReportType } from '../utils';
import { useTypeContext } from '../context';
import { Report, ReportDevice, ReportMonitoringPoint } from '../types';
import {
  DeviceEvalLevel,
  getDeviceEvalReason,
  getMonitoringPointEvalLevel,
  MonitoringPointEvalLevel,
  ReportType
} from '../constants';
import { PieChart } from './device';
import { PieChart as PieChart2 } from './monitoring-ponit-status';
import { ReportTable } from '../table';
import intl from 'react-intl-universal';
import { getDurationByDays } from '../../monitoring-point-corrosion/analysis/useAnalysis';
import { getAlarmDetail } from '../../alarm/alarm-group';
import { AlarmLevelTag } from '../../alarm';
import { MonitoringPointConclusion } from '../conclusion/monitoring-point';
import { DeviceConclusion } from '../conclusion/device';
import html2pdf from 'html2pdf.js';

export const Index2 = ({ report }: { report: Report }) => {
  const duration = `${Dayjs.format(report.start, 'YYYY/MM/DD')}-${Dayjs.format(
    report.end,
    'YYYY/MM/DD'
  )}`;
  const { devicesList, devicesStatistics } = getDeviceStatus(report);
  const { monitoringPoints, monitoringStatusStatistics } = getMonitoringPoints(report);
  const alarmRecords = getAlarmRecords(report);
  const cardRef = React.createRef<HTMLDivElement>();
  const { type } = useTypeContext();

  return (
    <Flex justify='center'>
      <Card
        style={{ position: 'relative', width: '210mm', height: 'auto' }}
        styles={{ body: { paddingBlock: 24, paddingInline: 32 } }}
      >
        <Button
          id='download-btn'
          onClick={() => {
            if (cardRef.current) {
              html2pdf()
                .set({
                  margin: 10,
                  html2canvas: {
                    scale: 2,
                    ignoreElements: (element: HTMLDivElement) => {
                      if (element.id === 'download-btn') {
                        return true;
                      }
                      return false;
                    }
                  },
                  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                  pagebreak: { mode: 'avoid-all' }
                } as any)
                .from(cardRef.current)
                .save();
            }
          }}
          style={{ position: 'absolute', right: 16 }}
        >
          download
        </Button>
        <div ref={cardRef}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <Typography.Title level={3}>{getTitle(type)}</Typography.Title>
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
                {
                  key: 'batteryVoltage',
                  dataIndex: 'batteryVoltage',
                  title: '电池电压',
                  width: 80
                },
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
          <section style={{ marginBottom: 32 }}>
            <div style={{ borderBottom: 'solid 1px', marginBottom: 16 }}>
              <Typography.Title level={4}>监测点状态</Typography.Title>
            </div>
            <PieChart2 statistics={monitoringStatusStatistics} />
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
                  key: 'thickness',
                  title: '厚度',
                  width: 120,
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
                  title: '减薄量',
                  width: 60,
                  render: (value: number) => getValue({ value, precision: 3 })
                },
                {
                  key: 'corrosion_rate',
                  dataIndex: 'corrosionRate',
                  title: '腐蚀速率',
                  width: 55,
                  render: (value: number) => getValue({ value, precision: 3 })
                },
                {
                  key: 'residual_life',
                  dataIndex: 'residualLife',
                  title: '剩余寿命',
                  width: 55,
                  render: (value: number) =>
                    getValue({ value: getDurationByDays(value).duration, precision: 0 })
                },
                {
                  key: 'evaluationLevel',
                  dataIndex: 'evaluationLevel',
                  title: '状态',
                  width: 70,
                  render: (level: number) => intl.get(getMonitoringPointEvalLevel(level))
                }
              ]}
              dataSource={monitoringPoints}
              showHeader={true}
            />
          </section>
          {alarmRecords && alarmRecords.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <div style={{ borderBottom: 'solid 1px', marginBottom: 16 }}>
                <Typography.Title level={4}>未处理报警小结</Typography.Title>
              </div>
              <ReportTable
                columns={[
                  {
                    title: intl.get('ALARM_SOURCE'),
                    dataIndex: 'source',
                    key: 'source',
                    render: (source: any) => {
                      if (source) {
                        return source.name;
                      }
                      return intl.get('UNKNOWN_SOURCE');
                    }
                  },
                  {
                    title: intl.get('ALARM_LEVEL'),
                    dataIndex: 'level',
                    key: 'level',
                    render: (level: number) => <AlarmLevelTag level={level} />
                  },
                  {
                    title: intl.get('ALARM_DETAIL'),
                    dataIndex: 'metric',
                    key: 'metric',
                    render: (metric: any, record: any) => getAlarmDetail(record, metric)
                  },
                  {
                    title: intl.get('ALARM_TIMESTAMP'),
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    render: (createdAt: number) => Dayjs.format(createdAt)
                  },
                  {
                    title: intl.get('ALARM_DURATION'),
                    dataIndex: 'duration',
                    key: 'duration',
                    render: (_: any, record: any) => {
                      switch (record.status) {
                        case 1:
                        case 2:
                          return Dayjs.toDate(record.createdAt).from(
                            Dayjs.toDate(record.updatedAt),
                            true
                          );
                        default:
                          return Dayjs.toDate(record.createdAt).fromNow(true);
                      }
                    }
                  }
                ]}
                dataSource={monitoringPoints}
                showHeader={true}
              />
            </section>
          )}
          <section style={{ marginBottom: 32 }}>
            <div style={{ borderBottom: 'solid 1px', marginBottom: 16 }}>
              <Typography.Title level={4}>结论与建议</Typography.Title>
            </div>
            <ul style={{ lineHeight: 2 }}>
              <MonitoringPointConclusion monitoringPoints={report.monitoringPoints} />
              <DeviceConclusion devices={report.devices} />
            </ul>
          </section>
        </div>
      </Card>
    </Flex>
  );
};

const getTitle = (type: ReportType) => {
  return `腐蚀测厚${getReportType(type)}报`;
};

const getDeviceStatus = (report: Report) => {
  const { devices } = report;
  const devicesList = devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error);
  const devicesStatistics = [
    devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Normal).length,
    devices.filter((d) => d.evaluationLevel === DeviceEvalLevel.Error).length
  ];
  return { devicesList, devicesStatistics };
};

const getMonitoringPoints = (report: Report) => {
  const { monitoringPoints } = report;
  const monitoringStatusStatistics = [
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Normal).length,
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Minor).length,
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Major).length,
    monitoringPoints.filter((m) => m.evaluationLevel === MonitoringPointEvalLevel.Critical).length
  ];
  return { monitoringPoints, monitoringStatusStatistics };
};

const getAlarmRecords = (report: Report) => {
  return (report.alarmRecords ?? []).filter((r: any) => r.status === 0);
};
