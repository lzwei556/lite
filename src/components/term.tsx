import React from 'react';
import { Space, Tooltip, Typography, SpaceProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const Term = ({
  name,
  description,
  ...rest
}: { name: string; description: string } & SpaceProps) => {
  return (
    <Space {...rest}>
      {name}
      <Tooltip placement='top' title={description.length === 0 ? name : description}>
        <Typography.Text type='secondary'>
          <QuestionCircleOutlined />
        </Typography.Text>
      </Tooltip>
    </Space>
  );
};
