import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'redux-react-hook';
import { GetCasbinRequest } from '../../apis/role';
import AlertMessageNotification from '../../components/notification/alert';
import { store } from '../../store';
import { SET_PERMISSION } from '../../store/actions/types';
import { isLogin } from '../../utils/session';
import HeaderLayout from './HeaderLayout';
import './layout.css';

export const PrimaryLayout = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isLogin()) {
      GetCasbinRequest().then((data) => {
        store.dispatch({
          type: SET_PERMISSION,
          payload: data
        });
      });
    }
  }, [dispatch]);

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
