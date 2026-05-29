import { Button, Form, Input } from 'antd';
import React from 'react';
import { TextFormItem } from '../../../components';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { useLogin } from '../../../providers/auth';
import { useNavigate } from 'react-router-dom';
import { createSubmitHandler } from 'resource';

export const LoginForm = ({ className }: { className?: string }) => {
  const username = intl.get('USERNAME');
  const navigate = useNavigate();
  const { submit, loading } = useLogin(() => navigate('/'));

  return (
    <div className={className}>
      <Form onFinish={createSubmitHandler(submit)}>
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
