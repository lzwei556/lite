import React from 'react';
import { Card, Chart, getOptions, useBarPieOptions } from '../../../components';
import { getValue } from '../../../utils';
import { useGlobalStyles } from '../../../styles';
import { ColorHealth, ColorOffline } from '../../../constants/color';
import {
  CrossMultiplePagesList,
  CrossMultiplePagesListProps,
  getRestSize,
  Rest
} from '../cross-multiply-pages-list';
import { ReportTable, ReportTableProps } from '../table';

const Pages = <T,>({ list }: Pick<CrossMultiplePagesListProps<T>, 'list'>) => {
  return (
    <CrossMultiplePagesList
      header={<Header list={list} />}
      headerSize={getHeaderSize(list)}
      list={list}
      renderPage={(page, index) => <DeviceTable dataSource={page} showHeader={index === 0} />}
    />
  );
};

const Header = <T,>({ list }: Pick<CrossMultiplePagesListProps<T>, 'list'>) => {
  return (
    <>
      <h3>一、设备状态</h3>
      <PieChart />
      {list.length > 0 && (
        <>
          <div className='split'></div>
          <h4 className='title'>异常设备</h4>
        </>
      )}
    </>
  );
};

const getHeaderSize = <T,>(list: T[]) => 8 + (list.length > 0 ? 1 : 0);

const DevicesRest = <T,>({ list }: Pick<CrossMultiplePagesListProps<T>, 'list'>) => {
  return (
    <Rest
      header={<Header list={list} />}
      headerSize={getHeaderSize(list)}
      list={list}
      renderPage={(page, _, first) => <DeviceTable dataSource={page} showHeader={!!first} />}
    />
  );
};

const PieChart = () => {
  const { colorTextDescriptionStyle } = useGlobalStyles();
  const commonOptions = useBarPieOptions();
  return (
    <Card styles={{ body: { padding: 0 } }}>
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
              data: [10, 5]
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

const DeviceTable = ({ dataSource, showHeader }: Omit<ReportTableProps, 'columns'>) => {
  return (
    <ReportTable
      columns={[
        // {
        //   key: 'mac',
        //   dataIndex: 'mac',
        //   title: 'MAC地址',
        //   width: 150,
        //   render: (mac: string) => (
        //     <span style={{ display: 'inline-block', minHeight: 34, lineHeight: '34px' }}>
        //       {mac}
        //     </span>
        //   )
        // },
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
        { key: 'evaluationReasons', dataIndex: 'evaluationReasons', title: '状态' }
      ]}
      dataSource={dataSource}
      showHeader={showHeader}
    />
  );
};

export const Device = {
  Pages,
  Rest: DevicesRest,
  getRestSize: <T,>(list: T[]) => getRestSize(list, getHeaderSize(list))
};
