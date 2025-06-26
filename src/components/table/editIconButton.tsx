import React from 'react';
import { Button, ButtonProps } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { IconButton } from './iconButton';

export const EditIconButton = (props: ButtonProps) => {
  const { variant = 'outlined', size = 'small', ...rest } = props;

  return (
    <IconButton title={intl.get('EDIT')} placement='left'>
      <Button {...rest} icon={<EditOutlined />} variant={variant} size={size} />
    </IconButton>
  );
};
