import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

export const Link = (
  props: Omit<LinkProps, 'to'> & { to?: LinkProps['to']; variant?: 'button' }
) => {
  const { to = '#!', onClick, variant, ...rest } = props;
  const isButton = variant === 'button';
  return (
    <RouterLink
      {...rest}
      to={to}
      onClick={(e) => {
        if (isButton) {
          e.preventDefault();
        }
        if (e.ctrlKey) {
          e.preventDefault();
        }
        onClick?.(e);
      }}
    />
  );
};
