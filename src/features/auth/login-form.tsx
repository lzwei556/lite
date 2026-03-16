import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { TextFormItem } from '../../components';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { useLogin } from '../../providers/auth';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { login, loading } = useLoginClick();

  return (
    <div className={'ts-login-form'}>
      <Form onFinish={(values) => login(values)}>
        <TextFormItem
          name='username'
          rules={[
            {
              required: true,
              message: Translation.pleaseEnterSth('auth.username')
            }
          ]}
          inputProps={{ placeholder: Translation.get('auth.username'), prefix: <UserOutlined /> }}
        />
        <TextFormItem
          name='password'
          rules={[
            {
              required: true,
              message: Translation.pleaseEnterSth('auth.password')
            }
          ]}
        >
          <Input.Password prefix={<KeyOutlined />} placeholder={Translation.get('auth.password')} />
        </TextFormItem>
        <TextFormItem>
          <Button type='primary' htmlType='submit' loading={loading}>
            {Translation.get('auth.login')}
          </Button>
        </TextFormItem>
      </Form>
    </div>
  );
};

const useLoginClick = () => {
  const navigate = useNavigate();
  const { run, loading } = useLogin(
    () => {
      navigate('/');
      message.success(Translation.get('feedback.success.login'));
    },
    (e) => message.error(Translation.get(e.message))
  );
  return { login: run, loading };
};
