import React from 'react';
import { Space, Tooltip, Typography, SpaceProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const Term = ({
  name,
  description,
  nameStyle,
  ...rest
}: { name: string; description: string; nameStyle?: React.CSSProperties } & SpaceProps) => {
  return (
    <Space {...rest}>
      <Typography.Text ellipsis title={name} style={nameStyle}>
        {name}
      </Typography.Text>
      <Tooltip placement='top' title={description.length === 0 ? name : description}>
        <Typography.Text type='secondary'>
          <QuestionCircleOutlined />
        </Typography.Text>
      </Tooltip>
    </Space>
  );
};
