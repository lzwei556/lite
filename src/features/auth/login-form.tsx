import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { TextFormItem } from '../../components';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { useLogin } from '../../providers/auth';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const username = intl.get('USERNAME');
  const { login, loading } = useLoginClick();

  return (
    <div className={'ts-login-form'}>
      <Form onFinish={(values) => login(values)}>
        <TextFormItem
          name='username'
          rules={[
            {
              required: true,
              message: intl.get('PLEASE_ENTER_SOMETHING', {
                something: username.toLowerCase()
              })
            }
          ]}
          inputProps={{ placeholder: username, prefix: <UserOutlined /> }}
        />
        <TextFormItem
          name='password'
          rules={[
            {
              required: true,
              message: intl.get('PLEASE_ENTER_SOMETHING', {
                something: intl.get('PASSWORD')
              })
            }
          ]}
        >
          <Input.Password prefix={<KeyOutlined />} placeholder={intl.get('PASSWORD')} />
        </TextFormItem>
        <TextFormItem>
          <Button type='primary' htmlType='submit' loading={loading}>
            {intl.get('LOGIN')}
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
      message.success(intl.get('LOGIN_SUCCEEDED'));
    },
    (e) => message.error(intl.get(e.message))
  );
  return { login: run, loading };
};
