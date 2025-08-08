import React from 'react';
import { Flex as AntFlex, FlexProps } from 'antd';

export const Flex = React.forwardRef(function Flex(
  { justify = 'flex-end', ...rest }: FlexProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return <AntFlex {...rest} justify={justify} ref={ref} />;
});
