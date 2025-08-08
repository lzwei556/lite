import React from 'react';
import { Button, ButtonProps, Tooltip } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';

export const SaveIconButton = ({
  color = 'primary',
  icon = <SaveOutlined />,
  size = 'small',
  variant = 'outlined',
  ...rest
}: ButtonProps) => {
  return (
    <Tooltip title={intl.get('SAVE')}>
      <Button color={color} icon={icon} size={size} variant={variant} {...rest} />
    </Tooltip>
  );
};
