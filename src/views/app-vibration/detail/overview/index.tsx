import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { Card, Grid } from '../../../../components';
import { AssetRow, MonitoringPointsTable } from '../../../asset-common';
import { SettingsDetail } from '../../../asset-variant';
import { AlarmTrend } from '../../../home/alarmTrend';
import DianJi from './dianji.png';
import { MonitoringPointsStatistics } from './monitoringPointsStatistics';

export const Index = (props: { asset: AssetRow }) => {
  const { asset } = props;
  return (
    <Grid>
      <Col span={24}>
        <Grid wrap={false}>
          <Col flex='360px'>
            <Grid>
              <Col span={24}>
                <MonitoringPointsStatistics {...props} />
              </Col>
              <Col span={24}>
                <AlarmTrend id={asset.id} title={intl.get('ALARM_TREND')} />
              </Col>
            </Grid>
          </Col>
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
