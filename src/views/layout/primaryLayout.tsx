import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import AlertMessageNotification from '../../components/notification/alert';
import HeaderLayout from './HeaderLayout';
import './layout.css';

export const PrimaryLayout = () => {
  return (
    <Layout>
      <HeaderLayout />
      <Layout>
        <Outlet />
      </Layout>
      <AlertMessageNotification />
    </Layout>
  );
};
