import { useEffect, useState } from 'react';
import { Col, Progress, Row, Statistic, Tag, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Translation } from 'locales/utils';
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
      <Typography.Title level={4}>{Translation.get('MENU_SYSTEM_STATUS')}</Typography.Title>
      <Grid>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <MutedCard title={Translation.get('system.info')} style={{ height: '100%' }}>
            <Descriptions
              items={[
                { label: Translation.get('system.os'), children: os.goos ?? '' },
                {
                  label: Translation.get('common.status'),
                  children: (
                    <Tag color={ColorHealth}>{Translation.get('system.status.running')}</Tag>
                  )
                },
                { label: Translation.get('system.mqtt.address'), children: mqtt.address ?? '' },
                { label: Translation.get('system.mqtt.account'), children: mqtt.username ?? '' },
                { label: Translation.get('system.mqtt.password'), children: mqtt.password ?? '' }
              ]}
            />
          </MutedCard>
        </Col>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <MutedCard title={Translation.get('system.disk.status')}>
            <Row justify={'start'}>
              <Col span={12}>
                <Grid>
                  <Col span={12}>
                    <Statistic
                      title={Translation.get('system.disk.total.mb')}
                      value={disk.totalMB}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic title={Translation.get('system.disk.total')} value={disk.totalGB} />
                  </Col>
                  <Col span={12}>
                    <Statistic title={Translation.get('system.disk.used.mb')} value={disk.usedMB} />
                  </Col>
                  <Col span={12}>
                    <Statistic title={Translation.get('system.disk.used')} value={disk.usedGB} />
                  </Col>
                </Grid>
              </Col>
              <Col span={12}>{renderUsedChart(disk.usedPercent ?? 0)}</Col>
            </Row>
          </MutedCard>
        </Col>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <MutedCard title={Translation.get('system.cpu.status')}>
            <Descriptions
              items={[
                {
                  label: Translation.get('system.cpu.core.numbers'),
                  children: cpu.cores ?? ''
                },
                {
                  label: Translation.get('system.cpu.numbers'),
                  children: cpu.cpus.length ?? ''
                },
                ...cpu.cpus.map((item, i) => ({
                  label: `${Translation.get('system.cpu.core')}${i}`,
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
          <MutedCard title={Translation.get('system.memory.status')}>
            <Row justify={'start'}>
              <Col span={12}>
                <Grid>
                  <Col span={24}>
                    <Statistic
                      title={Translation.get('system.disk.total.mb')}
                      value={ram.totalMB}
                    />
                  </Col>
                  <Col span={24}>
                    <Statistic title={Translation.get('system.disk.used.mb')} value={ram.usedMB} />
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
