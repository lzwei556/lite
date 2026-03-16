import React, { FC } from 'react';
import { Col, Row } from 'antd';
import { useGlobalStyles } from '../../styles';
import ad from '../../assets/images/login-ad-dark.png';
import { Brand } from '../layout/brand';
import './login.css';
import { LoginForm } from '../../features/auth';
import { isLanguageChinese, LanguagesDropdown, useI18n } from 'providers/i18n';

const LoginPage: FC = () => {
  const { language } = useI18n();
  const { colorWhiteStyle } = useGlobalStyles();

  return (
    <div id='login-page'>
      <div className={'logo'}>
        <Row justify='center' align='bottom'>
          <Col span={24}>
            <Brand
              height={80}
              gap={48}
              brandNameStyle={{ fontSize: 42, letterSpacing: isLanguageChinese(language) ? 12 : 0 }}
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
        <LanguagesDropdown style={colorWhiteStyle} />
      </div>
    </div>
  );
};

export default LoginPage;
