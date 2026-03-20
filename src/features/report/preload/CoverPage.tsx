import React from 'react';
import { A4Page } from '../components/A4Page';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
  `,
  center: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 50px;
    height: 300px;
  `,
  title: css`
    font-size: 30px;
    font-weight: 600;
  `,
  info: css`
    margin-top: 60px;
    font-size: 18px;
    font-weight: 600;
  `
}));

export const CoverPage = () => {
  const { styles } = useStyles();

  return (
    <A4Page>
      <div className={styles.container}>
        <div className={styles.center}>
          <div className={styles.title}>螺栓预紧力监测报告</div>
          <div className={styles.info}>
            <div>客户名称：</div>
            <div>监测周期：202X/XX/XX – 202X/XX/XX</div>
            <div>报告日期：202X/XX/XX</div>
          </div>
        </div>
      </div>
    </A4Page>
  );
};
