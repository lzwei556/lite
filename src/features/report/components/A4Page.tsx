import { Card } from 'components';
import React from 'react';

export const A4Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ height: '290mm', fontFamily: 'SimSun, serif' }}>{children}</div>
  );
};
