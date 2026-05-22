import React from 'react';
import { createStyles } from 'antd-style';
import { useLocaleContext } from '../../../localeProvider';
import loginBg from './login-bg-dark.jpg';
import { useGlobalStyles } from 'styles';

const useStyles = createStyles(({ css }) => ({
  page: css`
    background-image: url(${loginBg});
    background-size: cover;
    position: fixed;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    text-align: center;
  `,
  logo: css`
    padding-top: 8%;
    position: relative;
    display: inline-block;

    @media (max-width: 840px) {
      margin-top: 50px;

      .ant-space {
        gap: 0 !important;
      }
      .split-line {
        display: none;
      }
      .title {
        display: none;
      }
    }
  `,
  splitLineWrapper: css`
    margin-block: 60px;
  `,
  splitLine: css`
    height: 1px;
    width: 100%;
    background: linear-gradient(244deg, #2f3243, #c30d23 50%, #2f3243);
  `,
  loginForm: css`
    padding-top: 18%;
    text-align: start;

    .ant-form {
      display: flex;
      justify-content: space-between;
      margin: auto;
      width: 840px;
    }
    .ant-form-item {
      width: 30%;
    }
    button {
      width: 100%;
      font-weight: bold;
    }

    @media (max-width: 840px) {
      padding-top: 0;
      padding: 30px;
      .ant-form {
        display: initial;
        justify-content: initial;
        width: auto;
      }
      .ant-form-item {
        width: 100%;
      }
    }
  `,
  langSwitcher: css`
    position: fixed;
    bottom: 20px;
  `
}));

export const useLoginStyles = () => {
  const { language } = useLocaleContext();
  const { styles } = useStyles();

  const brandName: React.CSSProperties = {
    paddingInline: 60,
    fontSize: 42,
    letterSpacing: language === 'zh-CN' ? 12 : 0
  };

  const languageSwitcherStyle = useGlobalStyles().colorWhiteStyle;

  return { styles, brandName, languageSwitcherStyle };
};
