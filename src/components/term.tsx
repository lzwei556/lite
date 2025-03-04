import React from 'react';
import { Space, Tooltip, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const Term = ({ name, description }: { name: string; description: string }) => {
  return (
    <Space>
      {name}
      <Tooltip placement='top' title={description.length === 0 ? name : description}>
        <Typography.Text type='secondary'>
          <QuestionCircleOutlined />
        </Typography.Text>
      </Tooltip>
    </Space>
  );
};
