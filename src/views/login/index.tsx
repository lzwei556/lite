import React, { FC } from 'react';
import { Col, Row } from 'antd';
import { useGlobalStyles } from '../../styles';
import ad from '../../assets/images/login-ad-dark.png';
import { LangSwitcher, useLocaleContext } from '../../localeProvider';
import { Brand } from '../layout/brand';
import './login.css';
import { LoginForm } from '../../features/auth';

const LoginPage: FC = () => {
  const { language } = useLocaleContext();
  const { colorWhiteStyle } = useGlobalStyles();

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
      <LoginForm />
      <div style={{ position: 'fixed', bottom: 20 }}>
        <LangSwitcher style={colorWhiteStyle} />
      </div>
    </div>
  );
};

export default LoginPage;
