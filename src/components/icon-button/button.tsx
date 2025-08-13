import React from 'react';
import { Button, ButtonProps, Tooltip, TooltipProps } from 'antd';

export type IconButtonProps = ButtonProps & { tooltipProps?: TooltipProps };

export const IconButton = ({ tooltipProps, ...rest }: IconButtonProps) => {
  return (
    <Tooltip {...tooltipProps}>
      <Button {...rest} />
    </Tooltip>
  );
};
