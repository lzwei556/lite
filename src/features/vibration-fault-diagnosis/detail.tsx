import React from 'react';
import { Descriptions, MutedCard } from '../../components';
import {
  InfoCircleOutlined,
  LineChartOutlined,
  SafetyOutlined,
  SunOutlined
} from '@ant-design/icons';
import { Divider, List, Space } from 'antd';
import { useGlobalStyles } from '../../styles';
import { FaultDiagnosisOverview } from './overvew';
import { FaultDiagnosis } from './common';
import { getHealthStatusByValue } from './health-status';
import { getFaultByCategory } from './fault';

export const FaultDiagnosisDetail = () => {
  const diagnosis: FaultDiagnosis = {
    healthIndex: 48,
    timestamp: 1762486214,
    status: getHealthStatusByValue(3),
    faults: [1].map(getFaultByCategory)
  };
  return (
    <MutedCard title=''>
      <FaultDiagnosisOverview {...{ name: 'dfd', ...diagnosis }} />
      <Divider />
      <FaultDiagnosisDetailItem />
    </MutedCard>
  );
};

const FaultDiagnosisDetailItem = () => {
  const { colorPrimaryStyle } = useGlobalStyles();
  return (
    <Descriptions
      bordered={true}
      items={[
        { label: '故障名称', children: '电机驱动端轴承故障' },
        {
          label: '频谱分析',
          children: (
            <List
              dataSource={[
                {
                  avator: <SunOutlined />,
                  title: '主要特征',
                  content:
                    '在约 91.26 Hz 处出现显著峰值，对应包络加速度幅值约 7.544 gE。该频率与电机驱动端轴承外圈故障特征频率接近，说明可能存在早期轴承损伤'
                },
                {
                  avator: <InfoCircleOutlined />,
                  title: '诊断结论',
                  content:
                    '检测结果显示电机驱动端轴承存在异常振动特征，可能由滚动体或滚道轻微损伤引起。建议进行进一步检测或更换润滑脂，如异常持续或加剧，则需更换轴承'
                },
                {
                  avator: <SafetyOutlined />,
                  title: '维护建议',
                  content: (
                    <List
                      dataSource={[
                        { title: '短期', content: '监控加速度包络趋势，确认是否持续上升' },
                        { title: '中期', content: '进行轴承温度和润滑状态检查' },
                        { title: '长期', content: '计划性更换轴承以防止二次损坏' }
                      ]}
                      renderItem={(item) => (
                        <div style={{ marginBottom: 8 }}>
                          <Space>
                            {item.title}
                            {item.content}
                          </Space>
                        </div>
                      )}
                      split={false}
                    />
                  )
                },
                {
                  avator: <LineChartOutlined />,
                  title: '频谱图',
                  content: 'chart'
                }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<span style={colorPrimaryStyle}>{item.avator}</span>}
                    title={<span style={{ fontWeight: 400 }}>{item.title}</span>}
                    description={<span style={{ color: 'rgba(0,0,0,0.88)' }}>{item.content}</span>}
                  />
                </List.Item>
              )}
            />
          )
        }
      ]}
      labelStyle={{ width: '6em' }}
      contentStyle={{ justifyContent: 'flex-start' }}
    />
  );
};
