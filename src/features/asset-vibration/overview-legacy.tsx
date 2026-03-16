import React from 'react';
import { Col } from 'antd';
import { Translation } from 'locales/utils';
import { Card, Grid, IconButton } from '../../components';
import { AssetRow, AlarmsObjectStatistics, AlarmTrend } from '../../asset-common';
import { SelectedPointPropertyHistory } from '../../asset-model';
import { AssetAnnotationImage } from '../imageAnnotation';
import { EyeOutlined } from '@ant-design/icons';
import { ModalWrapper } from '../../components/modalWrapper';
import { SettingsDetail } from '../../asset-variant';

export const OverviewLegacy = (props: { asset: AssetRow; onSuccess?: () => void }) => {
  const { asset, onSuccess } = props;
  const number = asset.monitoringPoints?.length ?? 0;
  const [open, setOpen] = React.useState(false);

  return (
    <Grid>
      <Col span={24}>
        <Grid wrap={false}>
          <Col flex='auto'>
            <AssetAnnotationImage
              asset={asset}
              key={`${asset.id}_${number}_${asset.image}`}
              onSuccess={onSuccess}
              viewIcon={
                <React.Fragment key='view'>
                  <IconButton
                    icon={<EyeOutlined />}
                    onClick={() => setOpen(true)}
                    tooltipProps={{ title: Translation.get('common.action.view') }}
                    variant='outlined'
                  />
                  <ModalWrapper
                    open={open}
                    onCancel={() => setOpen(false)}
                    title={Translation.get('common.basic')}
                    footer={null}
                  >
                    <Card>
                      <SettingsDetail attributes={asset.attributes} type={asset.type} />
                    </Card>
                  </ModalWrapper>
                </React.Fragment>
              }
              title={Translation.get('monitoring.points')}
            />
          </Col>
          <Col flex='350px'>
            <Grid>
              <Col span={24}>
                <AlarmsObjectStatistics
                  chartHeight={262}
                  total={asset.statistics.monitoringPointNum}
                  alarms={asset.statistics.alarmNum}
                  title={Translation.get('monitoring.points')}
                  subtext={Translation.get('common.total')}
                />
              </Col>
              <Col span={24}>
                <AlarmTrend
                  id={asset.id}
                  title={Translation.get('alarm.trend')}
                  chartStyle={{ height: 262 }}
                />
              </Col>
            </Grid>
          </Col>
        </Grid>
      </Col>
      {number > 0 && (
        <Col span={24}>
          <SelectedPointPropertyHistory />
        </Col>
      )}
    </Grid>
  );
};
