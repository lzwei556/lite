import React from 'react';
import { Dayjs } from '../../../utils';
import {
  CrossMultiplePagesList,
  CrossMultiplePagesListProps,
  getRestSize,
  Rest
} from '../cross-multiply-pages-list';
import { ReportTable, ReportTableProps } from '../table';
import { Report } from '../types';
import intl from 'react-intl-universal';
import { AlarmLevelTag } from '../../../features/alarm';
import { getAlarmDetail } from '../../../features/alarm/alarm-group';

type Record = Report['alarmRecords'][0];

const Pages = ({
  list,
  header,
  headerSize
}: Pick<CrossMultiplePagesListProps<Record>, 'list' | 'header' | 'headerSize'>) => {
  return (
    <CrossMultiplePagesList
      header={<Header header={header} list={list} />}
      headerSize={getHeaderSize(list, headerSize)}
      list={list}
      renderPage={(page, index) => <InfoTable dataSource={page} showHeader={index === 0} />}
    />
  );
};

const Header = ({ header, list }: Pick<CrossMultiplePagesListProps<Record>, 'header' | 'list'>) => {
  return (
    <>
      {header}
      {list.length > 0 && (
        <>
          <div className='split'></div>
          <h3>六、未处理报警</h3>
        </>
      )}
    </>
  );
};

const getHeaderSize = (list: Record[], prev = 0) => prev + (list.length > 0 ? 2 : 0);

const AlarmRecordsRest = ({
  list,
  header,
  headerSize
}: Pick<CrossMultiplePagesListProps<Record>, 'list' | 'header' | 'headerSize'>) => {
  return (
    <Rest
      header={<Header header={header} list={list} />}
      headerSize={getHeaderSize(list, headerSize)}
      list={list}
      renderPage={(page, _, first) => <InfoTable dataSource={page} showHeader={!!first} />}
    />
  );
};

const InfoTable = ({ dataSource, showHeader }: Omit<ReportTableProps<Record>, 'columns'>) => {
  return (
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
                return Dayjs.toDate(record.createdAt).from(Dayjs.toDate(record.updatedAt), true);
              default:
                return Dayjs.toDate(record.createdAt).fromNow(true);
            }
          }
        }
      ]}
      dataSource={dataSource}
      showHeader={showHeader}
    />
  );
};

export const AlarmRecord = {
  Pages,
  Rest: AlarmRecordsRest,
  getRestSize: (list: Record[], prev?: number) => getRestSize(list, getHeaderSize(list, prev))
};
