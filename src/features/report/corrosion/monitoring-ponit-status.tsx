import React from 'react';
import intl from 'react-intl-universal';
import { getValue } from '../../../utils';
import { useGlobalStyles } from '../../../styles';
import { Card, Chart, getOptions, useBarPieOptions } from '../../../components';
import { ColorDanger, ColorHealth, ColorInfo, ColorWarn } from '../../../constants/color';
import { getDurationByDays } from '../../monitoring-point-corrosion/analysis/useAnalysis';
import {
  CrossMultiplePagesList,
  CrossMultiplePagesListProps,
  getRestSize,
  Rest
} from '../cross-multiply-pages-list';
import { ReportTable, ReportTableProps } from '../table';
import { ReportMonitoringPoint } from '../types';
import { useTypeContext } from '../context';
import { getReportType } from '../utils';
import { getMonitoringPointEvalLevel } from '../constants';

const PrevHeaderSizeMax = 11;

const Pages = ({
  list,
  header,
  headerSize = 0,
  statistics
}: Pick<CrossMultiplePagesListProps<ReportMonitoringPoint>, 'list' | 'header' | 'headerSize'> & {
  statistics: number[];
}) => {
  if (headerSize > PrevHeaderSizeMax) {
    debugger;
    return (
      <>
        <section className='page'>{header}</section>
        <CrossMultiplePagesList
          header={<Header header={null} statistics={statistics} />}
          headerSize={getHeaderSize(list)}
          list={list}
          renderPage={(page, index) => <InfoTable dataSource={page} showHeader={index === 0} />}
        />
      </>
    );
  } else {
    return (
      <CrossMultiplePagesList
        header={<Header header={header} statistics={statistics} />}
        headerSize={getHeaderSize(list, headerSize)}
        list={list}
        renderPage={(page, index) => <InfoTable dataSource={page} showHeader={index === 0} />}
      />
    );
  }
};

const Header = ({
  header,
  statistics
}: Pick<CrossMultiplePagesListProps<ReportMonitoringPoint>, 'header'> & {
  statistics: number[];
}) => {
  return (
    <>
      {header}
      <div className='split'></div>
      <h3>五、监测点状态</h3>
      <PieChart statistics={statistics} />
      <div className='split'></div>
    </>
  );
};

const getHeaderSize = (list: ReportMonitoringPoint[], prev = 0) =>
  prev + 6 + (list.length > 0 ? 2 : 0);

const MonitoringPointsRest = ({
  list,
  header,
  headerSize = 0,
  statistics
}: Pick<CrossMultiplePagesListProps<ReportMonitoringPoint>, 'list' | 'header' | 'headerSize'> & {
  statistics: number[];
}) => {
  if (headerSize > PrevHeaderSizeMax) {
    return (
      <Rest
        header={<Header header={null} statistics={statistics} />}
        headerSize={getHeaderSize(list)}
        list={list}
        renderPage={(page, _, first) => <InfoTable dataSource={page} showHeader={!!first} />}
      />
    );
  } else {
    return (
      <Rest
        header={<Header header={header} statistics={statistics} />}
        headerSize={getHeaderSize(list, headerSize)}
        list={list}
        renderPage={(page, _, first) => <InfoTable dataSource={page} showHeader={!!first} />}
      />
    );
  }
};

const PieChart = ({ statistics }: { statistics: number[] }) => {
  const { colorTextDescriptionStyle } = useGlobalStyles();
  const commonOptions = useBarPieOptions();
  const options = getOptions(commonOptions, {
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
        item: ['正常', '低风险', '中风险', '高风险'],
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
    color: [ColorHealth, ColorInfo, ColorWarn, ColorDanger]
  });

  return (
    <Card styles={{ body: { padding: 0 } }}>
      <Chart options={options} />
    </Card>
  );
};

const InfoTable = ({
  dataSource,
  showHeader
}: Omit<ReportTableProps<ReportMonitoringPoint>, 'columns'>) => {
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
        // {
        //   key: 'evaluationReasons',
        //   dataIndex: 'evaluationReasons',
        //   title: '状态',
        //   width: 70,
        // }
        {
          key: 'evaluationLevel',
          dataIndex: 'evaluationLevel',
          title: '状态',
          width: 70,
          render: (level: number) => intl.get(getMonitoringPointEvalLevel(level))
        }
      ]}
      dataSource={dataSource}
      showHeader={showHeader}
    />
  );
};

export const MonitoringPointsStatus = {
  Pages,
  Rest: MonitoringPointsRest,
  getRestSize: (list: ReportMonitoringPoint[], prev?: number) => {
    if (prev && prev > PrevHeaderSizeMax) {
      return getRestSize(list, getHeaderSize(list));
    } else {
      return getRestSize(list, getHeaderSize(list, prev));
    }
  }
};
