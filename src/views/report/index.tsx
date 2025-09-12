import React from 'react';
import { Outlet } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import { TypeProvider } from './context';

export default function Reports() {
  return (
    <TypeProvider>
      <Content>
        <Outlet />
      </Content>
    </TypeProvider>
  );
}
