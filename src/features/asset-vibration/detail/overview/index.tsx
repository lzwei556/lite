import React from 'react';
import { Col } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Card, Grid, IconButton } from '../../../../components';
import { ModalWrapper } from '../../../../components/modalWrapper';
import {
  AssetRow,
  EmptyMonitoringPoints,
  AlarmsObjectStatistics,
  AlarmTrend
} from '../../../../asset-common';
import { SettingsDetail } from '../../../../asset-variant';
import { SelectedPointPropertyHistory } from '../../../../asset-model';
import { DianJiImage } from './dianJiImage';

export const Index = (props: { asset: AssetRow; onSuccess: () => void }) => {
  const { asset, onSuccess } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <EmptyMonitoringPoints asset={asset}>
      <Grid>
        <Col span={24}>
          <Grid wrap={false} align='stretch'>
            <Col flex='auto'>
              <DianJiImage
                asset={asset}
                key={`${asset.id}_${asset.monitoringPoints?.length}_${asset.image}`}
                viewIcon={
                  <React.Fragment key='view'>
                    <IconButton
                      icon={<EyeOutlined />}
                      onClick={() => setOpen(true)}
                      tooltipProps={{ title: intl.get('CLICK_TO_VIEW') }}
                      variant='outlined'
                    />
                    <ModalWrapper
                      open={open}
                      onCancel={() => setOpen(false)}
                      title={intl.get('BASIC_INFORMATION')}
                      footer={null}
                    >
                      <Card>
                        <SettingsDetail settings={asset.attributes} type={asset.type} />
                      </Card>
                    </ModalWrapper>
                  </React.Fragment>
                }
                onSuccess={onSuccess}
              />
            </Col>
            <Col flex='300px'>
              <Grid>
                <Col span={24}>
                  <AlarmsObjectStatistics
                    total={asset.statistics.monitoringPointNum}
                    alarms={asset.statistics.alarmNum}
                    title={intl.get('monitoring.points.statistics')}
                    subtext={intl.get('monitoring.points.total')}
                  />
                </Col>
                <Col span={24}>
                  <AlarmTrend
                    id={asset.id}
                    title={intl.get('ALARM_TREND')}
                    chartStyle={{ height: 210 }}
                  />
                </Col>
              </Grid>
            </Col>
          </Grid>
        </Col>
        <Col span={24}>
          <SelectedPointPropertyHistory />
        </Col>
      </Grid>
    </EmptyMonitoringPoints>
  );
};
