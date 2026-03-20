import React from 'react';
import { useReportBaseStyles } from './style';

export const ConclusionSection = () => {
  const { styles } = useReportBaseStyles();

  return (
    <div className={styles.section}>
      <div className={styles.title}>5 结论及建议</div>

      <p className={styles.text}>
        本次报告周期内，风机螺栓监测系统运行正常，测点均在正常波动范围内，未发生预警。
      </p>

      <p className={styles.text}>
        详细判定依据及运维建议参见状态一览表及单台分析部分。
      </p>
    </div>
  );
};
