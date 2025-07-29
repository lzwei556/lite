import React, { FC, useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router';
import { useDispatch } from 'redux-react-hook';
import intl from 'react-intl-universal';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { LoginRequest } from '../../apis/user';
import ad from '../../assets/images/login-ad-dark.png';
import { userLoginSuccess } from '../../store/actions/userLoginSuccess';
import { LangSwitcher } from '../../localeProvider/switcher';
import { isLogin } from '../../utils/session';
import { useLocaleContext } from '../../localeProvider';
import { Brand } from '../layout/brand';
import './login.css';
import { TextFormItem } from '../../components';

const LoginPage: FC = () => {
  const { language } = useLocaleContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = (values: any) => {
    setIsLoading(true);
    LoginRequest(values.username, values.password).then((res) => {
      setIsLoading(false);
      if (res.code === 200) {
        message.success(intl.get('LOGIN_SUCCEEDED')).then();
        dispatch(userLoginSuccess(res.data));
        navigate('/');
      } else {
        message.error(intl.get(res.msg)).then();
      }
    });
  };

  useEffect(() => {
    if (isLogin()) {
      redirect('/');
    }
  }, []);
  const username = intl.get('USERNAME');

  return (
    <div id='login-page'>
      <div className={'logo'}>
        <Row justify='center' align='bottom'>
          <Col span={24}>
            <Brand
              height={80}
              gap={48}
              brandNameStyle={{ fontSize: 42, letterSpacing: language === 'zh-CN' ? 12 : 0 }}
            />
          </Col>
        </Row>
        <br />
        <Row justify='center' align='bottom' style={{ visibility: 'hidden' }}>
          <Col span={24}>
            <img src={ad} alt='Theta' />
          </Col>
        </Row>
        <br />
        <Row justify='center' align='bottom'>
          <Col span={24} className='split-line' />
        </Row>
      </div>
      <div className={'ts-login-form'}>
        <Form onFinish={login}>
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
            rules={[{ required: true, message: intl.get('PLEASE_ENTER_PASSWORD') }]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder={intl.get('PASSWORD')} />
          </TextFormItem>
          <TextFormItem>
            <Button type='primary' htmlType='submit' loading={isLoading}>
              {intl.get('LOGIN')}
            </Button>
          </TextFormItem>
        </Form>
      </div>
      <div style={{ position: 'fixed', bottom: 20 }}>
        <LangSwitcher style={{ color: '#fff' }} />
      </div>
    </div>
  );
};

export default LoginPage;
