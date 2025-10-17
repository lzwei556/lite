import React from 'react';
import { Report, ReportDevice } from '../../types';
import { getDeviceEvalReason, getDeviceStatus } from './common';
import { useGlobalStyles } from '../../../../styles';
import { ReportSection } from '../../components/section';
import { PieChart } from '../../components/pie-chart';
import { Typography } from 'antd';
import { ReportTable } from '../../components/table';
import { getValue, toMac } from '../../../../utils';
import intl from 'react-intl-universal';

export const DevicesStatusSection = ({ report }: { report: Report }) => {
  const { devicesList, devicesStatistics } = getDeviceStatus(report);
  const styles = useGlobalStyles();

  return (
    <ReportSection title='设备状态'>
      <PieChart statistics={devicesStatistics} />
      {devicesList.length > 0 && (
        <>
          <Typography.Paragraph style={{ fontSize: 16, textAlign: 'center' }}>
            异常设备
          </Typography.Paragraph>
          <ReportTable
            columns={[
              {
                key: 'mac',
                dataIndex: 'mac',
                title: 'MAC地址',
                width: 160,
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
                title: '电池电压（mV）',
                width: 120
              },
              {
                key: 'signalQuality',
                dataIndex: 'signalQuality',
                title: '信号强度',
                // width: 80,
                render: (value: number) => getValue({ value, precision: 1 })
              },
              {
                key: 'signalStrength',
                dataIndex: 'signalStrength',
                title: '信号质量',
                // width: 80,
                render: (value: number) => getValue({ value, precision: 1 })
              },
              {
                key: 'evaluationReasons',
                dataIndex: 'evaluationReasons',
                title: '状态',
                render: (reasons: number[], d: ReportDevice) => {
                  return (
                    <span style={styles.colorErrorStyle}>
                      {intl.get(getDeviceEvalReason(d.evaluationLevel, reasons))}
                    </span>
                  );
                }
              }
            ]}
            dataSource={devicesList}
            showHeader={true}
          />
        </>
      )}
    </ReportSection>
  );
};
