import React from 'react';
import { A4Page } from '../components/A4Page';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => ({
  section: css`
    margin-bottom: 16px;
  `,

  title: css`
    font-weight: bold;
    margin-bottom: 6px;
  `,

  text: css`
    text-indent: 2em;
    margin: 2px 0;
    font-size: 13px;
  `,
}));

export const ContentPage: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { styles } = useStyles();

  return (
    <A4Page>
      <div>{children}</div>
    </A4Page>
  );
};

export const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const { styles } = useStyles();

  return (
    <div className={styles.section}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};

export const Paragraph: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { styles } = useStyles();
  return <p className={styles.text}>{children}</p>;
};
