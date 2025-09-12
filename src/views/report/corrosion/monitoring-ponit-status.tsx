import React from 'react';
import { getValue } from '../../../utils';
import {
  CrossMultiplePagesList,
  CrossMultiplePagesListProps,
  getRestSize,
  Rest
} from '../cross-multiply-pages-list';
import { ReportTable, ReportTableProps } from '../table';
import { getDurationByDays } from '../../../features/monitoring-point-corrosion/analysis/useAnalysis';
import { Report } from '../types';
import { useTypeContext } from '../context';
import { getReportType } from '../utils';

const Pages = <T,>({
  list,
  header,
  headerSize
}: Pick<CrossMultiplePagesListProps<T>, 'list' | 'header' | 'headerSize'>) => {
  return (
    <CrossMultiplePagesList
      header={<Header header={header} list={list} />}
      headerSize={getHeaderSize(list, headerSize)}
      list={list}
      renderPage={(page, index) => <InfoTable dataSource={page} showHeader={index === 0} />}
    />
  );
};

const Header = <T,>({ header, list }: Pick<CrossMultiplePagesListProps<T>, 'header' | 'list'>) => {
  return (
    <>
      {header}
      {list.length > 0 && (
        <>
          <div className='split'></div>
          <h3>三、监测点状态</h3>
        </>
      )}
    </>
  );
};

const getHeaderSize = <T,>(list: T[], prev = 0) => prev + (list.length > 0 ? 2 : 0);

const MonitoringPointsRest = <T,>({
  list,
  header,
  headerSize
}: Pick<CrossMultiplePagesListProps<T>, 'list' | 'header' | 'headerSize'>) => {
  return (
    <Rest
      header={<Header header={header} list={list} />}
      headerSize={getHeaderSize(list, headerSize)}
      list={list}
      renderPage={(page, _, first) => <InfoTable dataSource={page} showHeader={!!first} />}
    />
  );
};

const InfoTable = ({ dataSource, showHeader }: Omit<ReportTableProps, 'columns'>) => {
  const { type } = useTypeContext();

  return (
    <ReportTable
      columns={[
        { key: 'index', dataIndex: 'indexName', title: '序号', width: 50 },
        // { key: 'assetName', dataIndex: 'assetName', title: '资产', width: 120 },
        {
          key: 'name',
          dataIndex: 'name',
          title: '名称', // width: 160,
          render: (value: string) => (
            <span
              style={{ display: 'inline-block', minHeight: 34, minWidth: 180, lineHeight: '34px' }}
            >
              {value}
            </span>
          )
        },
        {
          key: 'thickness',
          title: '厚度',
          width: 120,
          render: (_: string, m: Report['monitoringPoints'][0]) => {
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
        { key: 'evaluationReasons', dataIndex: 'evaluationReasons', title: '状态', width: 70 }
      ]}
      dataSource={dataSource}
      showHeader={showHeader}
    />
  );
};

export const MonitoringPointsStatus = {
  Pages,
  Rest: MonitoringPointsRest,
  getRestSize: <T,>(list: T[], prev?: number) => getRestSize(list, getHeaderSize(list, prev))
};
