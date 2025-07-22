import React from 'react';
import { Space, Tooltip, Typography, SpaceProps } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ParagraphProps } from 'antd/es/typography/Paragraph';

export const Term = ({
  name,
  description,
  nameProps,
  ...rest
}: { name: string; description: string; nameProps?: ParagraphProps } & SpaceProps) => {
  return (
    <Space {...rest}>
      <Typography.Text ellipsis title={name} {...nameProps}>
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
