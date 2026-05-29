import { Input, Typography } from 'antd';
import { LightSelectFilter, RangeDatePicker } from 'components';
import { MONITORING_POINT } from 'monitoring-point';
import { useAppConfig } from 'providers/app';
import React from 'react';
import intl from 'react-intl-universal';
import { Dayjs } from 'utils';

export const Filters = ({
  onNameChange,
  typesFilter,
  onRangeChange
}: {
  onNameChange: (name: string) => void;
  typesFilter?: { enabled: boolean; onChange: (types: number[]) => void };
  onRangeChange: (range: [number, number]) => void;
}) => {
  const options = useAppConfig().monitoringPointTypeOptions;

  return (
    <>
      <Input
        onBlur={(e) => onNameChange(e.target.value)}
        prefix={<Typography.Text type='secondary'>{intl.get('ALARM_NAME')}</Typography.Text>}
      />
      {typesFilter?.enabled && (
        <LightSelectFilter
          maxTagCount={2}
          mode='multiple'
          onChange={typesFilter?.onChange}
          options={options}
          prefix={intl.get('OBJECT_TYPE', { object: intl.get(MONITORING_POINT) })}
        />
      )}
      <RangeDatePicker onChange={(range) => onRangeChange(Dayjs.toRange(range))} />
    </>
  );
};
