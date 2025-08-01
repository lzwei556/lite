import { useEffect, useState } from 'react';
import { GetSystemRequest } from '../../apis/system';
import { Col, Progress, Row, Statistic, Tag } from 'antd';
import { System } from '../../types/system';
import { ColorHealth } from '../../constants/color';
import { Content } from 'antd/es/layout/layout';
import { PageTitle } from '../../components/pageTitle';
import intl from 'react-intl-universal';
import { Card, Chart, Descriptions, Grid } from '../../components';
import { generateColProps } from '../../utils/grid';

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
      <PageTitle items={[{ title: intl.get('MENU_SYSTEM_STATUS') }]} />
      <Grid>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <Card
            title={intl.get('SYSTEM_INFO')}
            size={'small'}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
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
          </Card>
        </Col>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <Card
            title={intl.get('HARD_DISK_STATUS')}
            size={'small'}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Row justify={'start'}>
              <Col span={6}>
                <Statistic title={intl.get('TOTAL_AMOUNT_MB')} value={disk.totalMB} />
                <Statistic title={intl.get('TOTAL_AMOUNT_GB')} value={disk.totalGB} />
              </Col>
              <Col span={6}>
                <Statistic title={intl.get('USED_AMOUNT_MB')} value={disk.usedMB} />
                <Statistic title={intl.get('USED_AMOUNT_GB')} value={disk.usedGB} />
              </Col>
              <Col span={12}>{renderUsedChart(disk.usedPercent ?? 0)}</Col>
            </Row>
          </Card>
        </Col>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <Card
            title={intl.get('CPU_RUNNING_STATUS')}
            size={'small'}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
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
          </Card>
        </Col>
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <Card
            title={intl.get('MEMORY_STATUS')}
            size={'small'}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Row justify={'start'}>
              <Col span={12}>
                <Statistic title={intl.get('TOTAL_AMOUNT_MB')} value={ram.totalMB} />
                <Statistic title={intl.get('USED_AMOUNT_MB')} value={ram.usedMB} />
              </Col>
              <Col span={12}>{renderUsedChart(ram.usedPercent ?? 0)}</Col>
            </Row>
          </Card>
        </Col>
      </Grid>
    </Content>
  );
};

export default SystemPage;
