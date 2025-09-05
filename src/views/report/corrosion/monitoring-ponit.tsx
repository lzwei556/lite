import React from 'react';
import {
  CrossMultiplePagesList,
  CrossMultiplePagesListProps,
  getRestSize,
  Rest
} from '../cross-multiply-pages-list';
import { ReportTable, ReportTableProps } from '../table';

const Pages = <T,>({
  list,
  header,
  headerSize
}: Pick<CrossMultiplePagesListProps<T>, 'list' | 'header' | 'headerSize'>) => {
  return (
    <CrossMultiplePagesList
      header={<Header header={header} />}
      headerSize={getHeaderSize(headerSize)}
      list={list}
      renderPage={(page, index) => <InfoTable dataSource={page} showHeader={index === 0} />}
    />
  );
};

const Header = <T,>({ header }: Pick<CrossMultiplePagesListProps<T>, 'header'>) => {
  return (
    <>
      {header}
      <div className='split'></div>
      <h3>二、监测点概况</h3>
    </>
  );
};

const getHeaderSize = (prev = 0) => prev + 1;

const MonitoringPointsRest = <T,>({
  list,
  header,
  headerSize
}: Pick<CrossMultiplePagesListProps<T>, 'list' | 'header' | 'headerSize'>) => {
  return (
    <Rest
      header={<Header header={header} />}
      headerSize={getHeaderSize(headerSize)}
      list={list}
      renderPage={(page, _, first) => <InfoTable dataSource={page} showHeader={!!first} />}
    />
  );
};

const InfoTable = ({ dataSource, showHeader }: Omit<ReportTableProps, 'columns'>) => {
  return (
    <ReportTable
      columns={[
        { key: 'index', dataIndex: 'index', title: '序号', width: 50 },
        { key: 'asset', dataIndex: 'asset', title: '资产', width: 120 },
        { key: 'name', dataIndex: 'name', title: '名称', width: 120 },
        { key: 'initial', dataIndex: 'initial', title: '初始厚度', width: 80 },
        { key: 'cri', dataIndex: 'cri', title: '临界厚度', width: 80 },
        { key: 'condition', dataIndex: 'condition', title: '报警条件' }
      ]}
      dataSource={dataSource}
      showHeader={showHeader}
    />
  );
};

export const MonitoringPointsInfo = {
  Pages,
  Rest: MonitoringPointsRest,
  getHeaderSize,
  getRestSize: <T,>(list: T[], prev?: number) => getRestSize(list, getHeaderSize(prev))
};
