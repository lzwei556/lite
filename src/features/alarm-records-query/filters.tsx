import { Input, Space, Typography } from 'antd';
import { LightSelectFilter, RangeDatePicker } from 'components';
import { MONITORING_POINT } from 'monitoring-point';
import { useAppConfig } from 'providers/app';
import React from 'react';
import intl from 'react-intl-universal';
import { Dayjs } from 'utils';

export const Filters = ({
  nameFilter,
  typesFilter,
  rangeFilter
}: {
  nameFilter?: { value?: string; onChange: (name: string) => void };
  typesFilter?: { enabled: boolean; value?: number[]; onChange: (types: number[]) => void };
  rangeFilter?: { value?: [number, number]; onChange: (range: [number, number]) => void };
}) => {
  const options = useAppConfig().monitoringPointTypeOptions;

  return (
    <Space>
      <Input
        onChange={(e) => nameFilter?.onChange(e.target.value)}
        prefix={<Typography.Text type='secondary'>{intl.get('ALARM_NAME')}</Typography.Text>}
        value={nameFilter?.value}
      />
      {typesFilter?.enabled && (
        <LightSelectFilter
          value={typesFilter?.value}
          maxTagCount={2}
          mode='multiple'
          onChange={typesFilter?.onChange}
          options={options}
          prefix={intl.get('OBJECT_TYPE', { object: intl.get(MONITORING_POINT) })}
        />
      )}
      <RangeDatePicker
        value={rangeFilter?.value ? Dayjs.toRangeValue(rangeFilter?.value) : undefined}
        onChange={(range) => rangeFilter?.onChange(Dayjs.toRange(range))}
      />
    </Space>
  );
};
