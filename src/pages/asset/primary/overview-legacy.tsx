import React from 'react';
import { Col } from 'antd';
import intl from 'react-intl-universal';
import { EyeOutlined } from '@ant-design/icons';
import { AlarmsObjectStatistics, AlarmTrend, AssetRow } from 'asset-common';
import { Card, Grid, IconButton } from 'components';
import { AssetAnnotationImage } from 'features/imageAnnotation';
import { ModalWrapper } from 'components/modalWrapper';
import { SelectedPointPropertyHistory } from 'asset-model/selected-point-property-history';
import { PrimaryAssetSettingsDetail } from 'features/asset-settings';


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
                      <PrimaryAssetSettingsDetail attributes={asset.attributes} type={asset.type} />
                    </Card>
                  </ModalWrapper>
                </React.Fragment>
              }
            />
          </Col>
          <Col flex='350px'>
            <Grid>
              <Col span={24}>
                <AlarmsObjectStatistics
                  chartHeight={280}
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
                  chartStyle={{ height: 265 }}
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
