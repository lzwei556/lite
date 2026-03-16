import React from 'react';
import { ReportTable } from '../components/table';
import { Translation } from 'locales/utils';
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
            title: Translation.get('alarm.source'),
            dataIndex: 'source',
            key: 'source',
            render: (source: any) => {
              if (source) {
                return source.name;
              }
              return Translation.get('common.unknown');
            }
          },
          {
            title: Translation.get('alarm.level'),
            dataIndex: 'level',
            key: 'level',
            render: (level: number) => <AlarmLevelTag level={level} />
          },
          {
            title: Translation.get('alarm.detail'),
            dataIndex: 'metric',
            key: 'metric',
            render: (metric: any, record: any) => getAlarmDetail(record, metric)
          },
          {
            title: Translation.get('alarm.created-at'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: number) => Dayjs.format(createdAt)
          },
          {
            title: Translation.get('alarm.consecutive.count'),
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
