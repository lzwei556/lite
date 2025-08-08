import { useEffect, useState } from 'react';
import { Col, Progress, Row, Statistic, Tag, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import intl from 'react-intl-universal';
import { GetSystemRequest } from '../../apis/system';
import { Chart, Descriptions, Grid, MutedCard } from '../../components';
import { generateColProps } from '../../utils/grid';
import { System } from '../../types/system';
import { ColorHealth } from '../../constants/color';

const SystemPage = () => {
  const [data, setData] = useState<System>();

  useEffect(() => {
    GetSystemRequest().then(setData);
  }, []);

  const renderUsedChart = (value: number) => {
    const option = {
      series: [
        {
          name: 'Pressure',
          type: 'gauge',
          progress: {
            show: true
          },
          pointer: {
            show: false //是否显示指针
          },
          itemStyle: {
            color: ColorHealth
          },
          detail: {
            fontSize: 28,
            valueAnimation: true,
            offsetCenter: [0, 0],
            formatter: '{value}%'
          },
          axisTick: false,
          axisLabel: false,
          splitLine: {
            show: false
          },
          data: [
            {
              value
            }
          ],
          label: {
            show: true
          }
        }
      ]
    };
    //@ts-ignore
    return <Chart options={option} style={{ height: '180px' }} />;
  };

  if (!data || !data.server || !data.mqtt) return null;
  const {
    mqtt,
    server: { os, cpu, ram, disk }
  } = data;

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_SYSTEM_STATUS')}</Typography.Title>
      <Grid>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <MutedCard title={intl.get('SYSTEM_INFO')} style={{ height: '100%' }}>
            <Descriptions
              items={[
                { label: intl.get('OEPRATING_SYSTEM'), children: os.goos ?? '' },
                {
                  label: intl.get('STATUS'),
                  children: <Tag color={ColorHealth}>{intl.get('RUNNING')}</Tag>
                },
                { label: intl.get('MQTT_ADDRESS'), children: mqtt.address ?? '' },
                { label: intl.get('MQTT_ACCOUNT'), children: mqtt.username ?? '' },
                { label: intl.get('MQTT_PASSWORD'), children: mqtt.password ?? '' }
              ]}
            />
          </MutedCard>
        </Col>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <MutedCard title={intl.get('HARD_DISK_STATUS')}>
            <Row justify={'start'}>
              <Col span={12}>
                <Grid>
                  <Col span={12}>
                    <Statistic title={intl.get('TOTAL_AMOUNT_MB')} value={disk.totalMB} />
                  </Col>
                  <Col span={12}>
                    <Statistic title={intl.get('TOTAL_AMOUNT_GB')} value={disk.totalGB} />
                  </Col>
                  <Col span={12}>
                    <Statistic title={intl.get('USED_AMOUNT_MB')} value={disk.usedMB} />
                  </Col>
                  <Col span={12}>
                    <Statistic title={intl.get('USED_AMOUNT_GB')} value={disk.usedGB} />
                  </Col>
                </Grid>
              </Col>
              <Col span={12}>{renderUsedChart(disk.usedPercent ?? 0)}</Col>
            </Row>
          </MutedCard>
        </Col>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <MutedCard title={intl.get('CPU_RUNNING_STATUS')}>
            <Descriptions
              items={[
                {
                  label: intl.get('NUMBER_OF_CPU_CORES'),
                  children: cpu.cores ?? ''
                },
                {
                  label: intl.get('NUMBER_OF_CPUS'),
                  children: cpu.cpus.length ?? ''
                },
                ...cpu.cpus.map((item, i) => ({
                  label: `${intl.get('CPU_CORE')}${i}`,
                  children: (
                    <Progress
                      status={'normal'}
                      strokeColor={ColorHealth}
                      percent={Number(item.toFixed(0))}
                      size={'small'}
                      style={{ width: '50%' }}
                    />
                  )
                }))
              ]}
            />
          </MutedCard>
        </Col>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <MutedCard title={intl.get('MEMORY_STATUS')}>
            <Row justify={'start'}>
              <Col span={12}>
                <Grid>
                  <Col span={24}>
                    <Statistic title={intl.get('TOTAL_AMOUNT_MB')} value={ram.totalMB} />
                  </Col>
                  <Col span={24}>
                    <Statistic title={intl.get('USED_AMOUNT_MB')} value={ram.usedMB} />
                  </Col>
                </Grid>
              </Col>
              <Col span={12}>{renderUsedChart(ram.usedPercent ?? 0)}</Col>
            </Row>
          </MutedCard>
        </Col>
      </Grid>
    </Content>
  );
};

export default SystemPage;
