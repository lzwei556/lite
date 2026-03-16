import React from 'react';
import { Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Translation } from 'locales/utils';
import { FilterableAlarmRecordTable } from './filterableAlarmRecordTable';

const AlarmRecordPage = () => {
  return (
    <Content>
      <Typography.Title level={4}>{Translation.get('alarm.records')}</Typography.Title>
      <FilterableAlarmRecordTable />
    </Content>
  );
};

export default AlarmRecordPage;
