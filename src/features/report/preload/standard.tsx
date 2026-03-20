import React from 'react';
import { useReportBaseStyles } from './style';

export const StandardSection = () => {
  const { styles } = useReportBaseStyles();

  return (
    <div className={styles.section}>
      <div className={styles.title}>2 参考标准</div>
      <p className={styles.text}>
        MySE4.0机组M42锚栓预紧力505kN
      </p>
    </div>
  );
};
