import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Chart, Card, Grid, getBarPieOption, getOptions } from '../../../../components';
import { Asset, AssetRow, MonitoringPointsTable } from '../../../asset-common';
import { SettingsDetail } from '../../../asset-variant';
import { AlarmTrend } from '../../../home/alarmTrend';
import DianJi from './dianji.png';

export const Index = (props: { asset: AssetRow }) => {
  const { asset } = props;
  const { statistics } = asset;
  const statisticsData = Asset.Statistics.resolveStatus(
    statistics.monitoringPointNum,
    statistics.alarmNum
  ).map((s) => ({
    ...s,
    name: intl.get(s.name),
    itemStyle: { color: s.color }
  }));
  const options = getOptions({
    ...getBarPieOption(),
    title: {
      text: `${statistics.monitoringPointNum}`,
      subtext: '监测点总数',
      left: 'center',
      top: 105,
      textStyle: {
        fontSize: 30
      }
    },
    series: [
      {
        type: 'pie',
        name: '',
        radius: ['50%', '60%'],
        center: ['50%', '48%'],
        label: { show: false, formatter: '{b} {c}' },
        data: statisticsData
      }
    ]
  });

  return (
    <Grid>
      <Col span={24}>
        <Grid wrap={false}>
          {statisticsData.length > 0 && (
            <Col flex='360px'>
              <Grid>
                <Col span={24}>
                  <Card
                    styles={{
                      header: {
                        border: 0,
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center'
                      },
                      body: { height: '100%' }
                    }}
                    title='监测点统计'
                  >
                    <Chart options={options} />
                  </Card>
                </Col>
                <Col span={24}>
                  <AlarmTrend id={asset.id} title={intl.get('ALARM_TREND')} />
                </Col>
              </Grid>
            </Col>
          )}
          <Col flex='auto'>
            <Card
              style={{ height: '100%' }}
              styles={{
                body: {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%'
                }
              }}
            >
              <img
                src={DianJi}
                alt=''
                style={{ display: 'block', maxWidth: '100%', objectFit: 'contain' }}
              />
            </Card>
          </Col>
          <Col flex='300px'>
            <Card style={{ height: '100%' }} title={intl.get('BASIC_INFORMATION')}>
              <SettingsDetail settings={asset.attributes} type={asset.type} />
            </Card>
          </Col>
        </Grid>
      </Col>
      <Col span={24}>
        <MonitoringPointsTable asset={asset} enableSettingColumnsCount={false} more={false} />
      </Col>
    </Grid>
  );
};
