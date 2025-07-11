import React from 'react';
import { Button, Tooltip, ButtonProps } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';

export const SaveIconButton = ({ onClick, ...rest }: ButtonProps) => {
  return (
    onClick && (
      <Tooltip title={intl.get('SAVE')}>
        <Button {...rest} icon={<SaveOutlined />} onClick={onClick} />
      </Tooltip>
    )
  );
};
