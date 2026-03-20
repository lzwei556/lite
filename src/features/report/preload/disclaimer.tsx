import React from 'react';
import { useReportBaseStyles } from './style';

export const DisclaimerSection = () => {
  const { styles } = useReportBaseStyles();

  return (
    <div className={styles.section}>
      <div className={styles.title}>免责申明</div>

      <p className={styles.noIndent}>
        1 报告仅对测点数据负责，监测结果反映阶段性状态。
      </p>
      <p className={styles.noIndent}>
        2 预测建议存在不确定性，需谨慎参考。
      </p>
      <p className={styles.noIndent}>
        3 报告仅供参考，不作为检修依据。
      </p>
      <p className={styles.noIndent}>
        4 未经许可不得复制或传播。
      </p>
    </div>
  );
};
