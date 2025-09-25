import React from 'react';
import intl from 'react-intl-universal';
import { Card, Chart, getOptions, useBarPieOptions } from '../../../components';
import { getValue, toMac } from '../../../utils';
import { useGlobalStyles } from '../../../styles';
import { ColorHealth, ColorOffline } from '../../../constants/color';
import { CrossMultiplePagesList, getRestSize, Rest } from '../cross-multiply-pages-list';
import { ReportTable, ReportTableProps } from '../table';
import { ReportDevice } from '../types';
import { getDeviceEvalReason } from '../constants';

const Pages = ({ list, statistics }: { list: ReportDevice[]; statistics: number[] }) => {
  return (
    <CrossMultiplePagesList
      header={<Header chart={<PieChart statistics={statistics} />} list={list} />}
      headerSize={getHeaderSize(list)}
      list={list}
      renderPage={(page, index) => <DeviceTable dataSource={page} showHeader={index === 0} />}
    />
  );
};

const Header = ({ chart, list }: { chart: React.ReactNode; list: ReportDevice[] }) => {
  return (
    <>
      <h3>三、设备状态</h3>
      {chart}
      {list.length > 0 && (
        <>
          <div className='split'></div>
          <h4 className='title'>异常设备</h4>
        </>
      )}
    </>
  );
};

const getHeaderSize = (list: ReportDevice[]) => 8 + (list.length > 0 ? 1 : 0);

const DevicesRest = ({ list, statistics }: { list: ReportDevice[]; statistics: number[] }) => {
  return (
    <Rest
      header={<Header chart={<PieChart statistics={statistics} />} list={list} />}
      headerSize={getHeaderSize(list)}
      list={list}
      renderPage={(page, _, first) => <DeviceTable dataSource={page} showHeader={!!first} />}
    />
  );
};

export const PieChart = ({ statistics }: { statistics: number[] }) => {
  const { colorTextDescriptionStyle } = useGlobalStyles();
  const commonOptions = useBarPieOptions();
  return (
    <Card style={{ border: 0, marginBottom: 16 }} styles={{ body: { padding: 0 } }}>
      <Chart
        options={getOptions(commonOptions, {
          title: {
            left: 'center',
            top: 16,
            text: '分布图'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{c}'
          },
          legend: {
            bottom: 16
          },
          dataset: {
            source: {
              item: ['正常', '异常'],
              data: statistics
            }
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                show: true,
                formatter: '{c}({d}%)',
                ...colorTextDescriptionStyle
              }
            }
          ],
          color: [ColorHealth, ColorOffline]
        })}
      />
    </Card>
  );
};

const DeviceTable = ({
  dataSource,
  showHeader
}: Omit<ReportTableProps<ReportDevice>, 'columns'>) => {
  return (
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
      dataSource={dataSource}
      showHeader={showHeader}
    />
  );
};

export const Device = {
  Pages,
  Rest: DevicesRest,
  getRestSize: (list: ReportDevice[]) => getRestSize(list, getHeaderSize(list))
};
