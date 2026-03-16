import { Button, Result, Space } from 'antd';
import React from 'react';
import { Translation } from 'locales/utils';

const UnauthorizedPage = () => {
  return (
    <Result
      status='403'
      title='403'
      subTitle={Translation.get('feedback.403')}
      extra={
        <Space>
          <Button
            type='default'
            onClick={() => {
              window.location.hash = '/';
            }}
          >
            {Translation.get('button.return-to-home')}
          </Button>
          <Button
            type='primary'
            onClick={() => {
              window.location.hash = '/login';
            }}
          >
            {Translation.get('auth.login')}
          </Button>
        </Space>
      }
    />
  );
};

export default UnauthorizedPage;
