import { Space, Typography } from 'antd';
import React from 'react';
import { getValue } from 'utils/format';

export const PropertyValueCard = ({
  title,
  values
}: {
  title: string;
  values: { unit: string; value?: number; precision?: number }[];
}) => {
  return (
    <Space direction='vertical'>
      <Typography.Text type='secondary'>{title}</Typography.Text>
      <Space size={4} style={{ height: 30 }}>
        {values.map(({ value, unit, precision }) => (
          <Typography.Text key={value} style={{ fontSize: values.length > 1 ? 14 : 18 }}>
            {getValue({ value, precision })}
            {value !== undefined && (
              <Typography.Text style={{ marginLeft: 4 }} type='secondary'>
                {unit}
              </Typography.Text>
            )}
          </Typography.Text>
        ))}
      </Space>
    </Space>
  );
};
