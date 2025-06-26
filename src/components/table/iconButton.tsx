import React from 'react';
import { ButtonProps, Tooltip, TooltipProps } from 'antd';

export const IconButton = (props: TooltipProps & { children: React.ReactElement<ButtonProps> }) => {
  const { children, ...rest } = props;
  return <Tooltip {...rest}>{children}</Tooltip>;
};
