import React from 'react';
import { getValue } from '../../../utils';
import {
  CrossMultiplePagesList,
  CrossMultiplePagesListProps,
  getRestSize,
  Rest
} from '../cross-multiply-pages-list';
import { ReportTable, ReportTableProps } from '../table';
import { ReportMonitoringPoint } from '../types';

const Pages = ({
  list,
  header,
  headerSize
}: Pick<CrossMultiplePagesListProps<ReportMonitoringPoint>, 'list' | 'header' | 'headerSize'>) => {
  return (
    <CrossMultiplePagesList
      header={<Header header={header} list={list} />}
      headerSize={getHeaderSize(list, headerSize)}
      list={list}
      renderPage={(page, index) => <InfoTable dataSource={page} showHeader={index === 0} />}
    />
  );
};

const Header = ({
  header,
  list
}: Pick<CrossMultiplePagesListProps<ReportMonitoringPoint>, 'header' | 'list'>) => {
  return (
    <>
      {header}
      {list.length > 0 && (
        <>
          <div className='split'></div>
          <h3>四、监测点概况</h3>
        </>
      )}
    </>
  );
};

const getHeaderSize = (list: ReportMonitoringPoint[], prev = 0) => prev + (list.length > 0 ? 2 : 0);

const MonitoringPointsRest = ({
  list,
  header,
  headerSize
}: Pick<CrossMultiplePagesListProps<ReportMonitoringPoint>, 'list' | 'header' | 'headerSize'>) => {
  return (
    <Rest
      header={<Header header={header} list={list} />}
      headerSize={getHeaderSize(list, headerSize)}
      list={list}
      renderPage={(page, _, first) => <InfoTable dataSource={page} showHeader={!!first} />}
    />
  );
};

const InfoTable = ({
  dataSource,
  showHeader
}: Omit<ReportTableProps<ReportMonitoringPoint>, 'columns'>) => {
  return (
    <ReportTable
      columns={[
        { key: 'index', dataIndex: 'indexName', title: '序号', width: 50 },
        // { key: 'assetName', dataIndex: 'assetName', title: '资产', width: 120 },
        {
          key: 'name',
          dataIndex: 'name',
          title: '名称',
          // width: 160,
          render: (value: string) => (
            <span
              style={{ display: 'inline-block', minHeight: 34, minWidth: 180, lineHeight: '34px' }}
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
      dataSource={dataSource}
      showHeader={showHeader}
    />
  );
};

export const MonitoringPointsInfo = {
  Pages,
  Rest: MonitoringPointsRest,
  getRestSize: (list: ReportMonitoringPoint[], prev?: number) =>
    getRestSize(list, getHeaderSize(list, prev))
};
