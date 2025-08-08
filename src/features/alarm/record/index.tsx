import React from 'react';
import { Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import intl from 'react-intl-universal';
import { FilterableAlarmRecordTable } from './filterableAlarmRecordTable';

const AlarmRecordPage = () => {
  return (
    <Content>
      <Typography.Title level={4}>{intl.get('ALARM_RECORDS')}</Typography.Title>
      <FilterableAlarmRecordTable />
    </Content>
  );
};

export default AlarmRecordPage;
