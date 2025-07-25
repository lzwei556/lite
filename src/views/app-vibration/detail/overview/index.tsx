import React from 'react';
import { Button, Col, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Card, commonRange, Grid } from '../../../../components';
import { ModalWrapper } from '../../../../components/modalWrapper';
import { Dayjs } from '../../../../utils';
import { HistoryDataFea } from '../../../../features';
import {
  AssetRow,
  EmptyMonitoringPoints,
  getDataOfMonitoringPoint,
  HistoryData
} from '../../../asset-common';
import { SettingsDetail } from '../../../asset-variant';
import { AlarmTrend } from '../../../home/alarmTrend';
import { appendAxisAliasLabelToField } from '../../point/common';
import { useAssetContext } from '../context';
import { MonitoringPointsStatistics } from './monitoringPointsStatistics';
import { DianJiImage } from './dianJiImage';

export const Index = (props: { asset: AssetRow; onSuccess: () => void }) => {
  const { asset, onSuccess } = props;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const [open, setOpen] = React.useState(false);
  const { selectedPoint, setSelectedPoint, firstPoint, properties } = useAssetContext();

  const fetchData = (id: number, range: [number, number]) => {
    if (range) {
      const [from, to] = range;
      setLoading(true);
      getDataOfMonitoringPoint(id, from, to).then((data) => {
        setLoading(false);
        if (data.length > 0) {
          setHistoryData(data);
        } else {
          setHistoryData(undefined);
        }
      });
    }
  };

  React.useEffect(() => {
    if (firstPoint?.id && !historyData) {
      fetchData(firstPoint.id, Dayjs.toRange(commonRange.PastWeek));
    }
  }, [firstPoint?.id, historyData]);

  return (
    <EmptyMonitoringPoints asset={asset}>
      <Grid>
        <Col span={24}>
          <Grid wrap={false}>
            <Col flex='auto' style={{ minWidth: 560 }}>
              <DianJiImage
                asset={asset}
                key={`${asset.id}_${asset.monitoringPoints?.length}_${asset.image}`}
                properties={properties}
                onSelectMonitoringPointProperty={(item) => {
                  if (item) {
                    setSelectedPoint(item);
                    if (!selectedPoint || selectedPoint.id !== item.id) {
                      fetchData(item.id, Dayjs.toRange(commonRange.PastWeek));
                    }
                  }
                }}
                viewIcon={
                  <React.Fragment key='view'>
                    <Tooltip title={intl.get('CLICK_TO_VIEW')}>
                      <Button
                        icon={<EyeOutlined />}
                        variant='outlined'
                        onClick={() => setOpen(true)}
                      />
                    </Tooltip>
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
            <Col flex='350px'>
              <Grid>
                <Col span={24}>
                  <MonitoringPointsStatistics {...props} />
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
        {selectedPoint && (
          <Col span={24}>
            <Card title={`${selectedPoint.name} ${selectedPoint.title}`} size='small'>
              <HistoryDataFea.PropertyChart
                config={{
                  opts: {
                    yAxis: { name: selectedPoint.property.unit },
                    grid: { top: 30 }
                  },
                  switchs: { noDataZoom: true }
                }}
                data={historyData}
                property={appendAxisAliasLabelToField(
                  selectedPoint.property,
                  selectedPoint.attributes
                )}
                axisKey={selectedPoint.axisKey}
                loading={loading}
                style={{ height: 140 }}
              />
            </Card>
          </Col>
        )}
      </Grid>
    </EmptyMonitoringPoints>
  );
};
