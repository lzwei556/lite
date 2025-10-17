import React from 'react';
import { useGlobalStyles } from '../../../styles';
import { Typography } from 'antd';

export const ReportSection = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const styles = useGlobalStyles();
  return (
    <section style={{ marginBottom: 32 }}>
      <div
        style={{
          borderBottom: `solid 1px ${styles.colorBorderStyle.color}`,
          marginBottom: 16
        }}
      >
        <Typography.Title level={4} style={{ marginBottom: 12 }}>
          {title}
        </Typography.Title>
      </div>
      {children}
    </section>
  );
};
