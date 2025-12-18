import React from 'react';
import { ReportTable } from '../components/table';
import intl from 'react-intl-universal';
import { AlarmLevelTag } from '../../alarm/alarmLevelTag';
import { getAlarmDetail } from '../../alarm/alarm-group';
import { Dayjs } from '../../../utils';
import { ReportSection } from '../components/section';

export const AlarmRecordsSection = ({ alarmRecords }: { alarmRecords: any }) => {

  return (
    <ReportSection title='未处理报警小结'>
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
            title: intl.get('alarm_group.consecutive_count'),
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
        dataSource={alarmRecords}
        showHeader={true}
      />
    </ReportSection>
  );
};
