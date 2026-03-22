import React from 'react';
import { ReportTable } from '../components/table';
import { useReportBaseStyles } from './style';

const data = [
  {
    level: 1,
    description: '良好',
    standard: '各部位螺栓预紧力在标准±30%以内波动，稳定性好。',
    suggestion: '无需处理。'
  },
  {
    level: 2,
    description: '注意',
    standard: '各部位螺栓预紧力在标准±35%以内波动。',
    suggestion: '提升监测频次，关注发展趋势。'
  },
  {
    level: 3,
    description: '预警',
    standard: '各部位螺栓预紧力在标准±40%以内波动。',
    suggestion: '现场查验力矩值，并对螺栓状态进行检查。'
  },
  {
    level: 4,
    description: '报警',
    standard: '各部位螺栓预紧力超出±40%。',
    suggestion: '现场查验力矩及螺栓，准备人员、材料及作业方案，对异常的螺栓实时检修。'
  },
  {
    level: 4,
    description: '通讯异常',
    standard: '个别传感器数据不能及时更新、或者整机、整条回路无法通讯等通讯类异常现象。',
    suggestion: '现场排查处理，尽快恢复通讯。'
  }
];

export const DefinitionSection = () => {
  const { styles } = useReportBaseStyles();
  return (
    <div className={styles.section}>
      <div className={styles.title}>3 状态定义</div>
      <ReportTable
        dataSource={data}
        showHeader={true}
        bordered={true}
        columns={[
          { align: 'center', dataIndex: 'level', title: '等级', width: 60 },
          { align: 'center', dataIndex: 'description', title: '状态描述', width: 120 },
          { dataIndex: 'standard', title: '判定标准' },
          { dataIndex: 'suggestion', title: '建议措施' }
        ]}
      />
    </div>
  );
};
