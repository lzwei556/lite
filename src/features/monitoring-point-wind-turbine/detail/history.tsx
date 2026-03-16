import React from 'react';
import { Col, Space } from 'antd';
import { Translation } from 'locales/utils';
import {
  Card,
  Flex,
  Grid,
  useRange,
  RangeDatePicker,
  DeleteIconButton,
  DownloadIconButton
} from '../../../components';
import { isMobile } from '../../../utils/deviceDetection';
import { Dayjs } from '../../../utils';
import {
  clearHistory,
  DownloadData,
  getDataOfMonitoringPoint,
  HistoryData,
  MonitoringPointRow,
  Point
} from '../../../asset-common';
import * as Tower from '../../asset-wind-turbine/tower';
import { HistoryChartCard } from './historyChartCard';
import { CanAccess, Permission } from '../../../providers/access-control';

export const History = (point: MonitoringPointRow) => {
  const { id, name, type, attributes } = point;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const { range, numberedRange, setRange } = useRange();
  const [from, to] = numberedRange;
  const isTowerRelated = Point.Assert.isTowerRelated(type);
  const [open, setVisible] = React.useState(false);

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
    fetchData(id, [from, to]);
  }, [id, from, to]);

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <Space>
              <RangeDatePicker onChange={setRange} />
              <CanAccess {...Permission.MeasurementDataDownload}>
                <DownloadIconButton
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              </CanAccess>
              {open && (
                <DownloadData
                  measurement={point}
                  open={open}
                  onSuccess={() => setVisible(false)}
                  onCancel={() => setVisible(false)}
                  range={range}
                />
              )}
            </Space>
          </Flex>
        </Card>
      </Col>
      {isTowerRelated && (
        <Col span={isMobile ? 24 : 8}>
          <Tower.PointsScatterChart
            cardProps={{}}
            data={[
              {
                name,
                history: historyData,
                height: attributes?.tower_install_height,
                radius: attributes?.tower_base_radius
              }
            ]}
            type={type}
          />
        </Col>
      )}
      <Col span={isTowerRelated ? (isMobile ? 24 : 16) : 24}>
        <HistoryChartCard
          point={point}
          historyData={historyData}
          loading={loading}
          range={range}
          deleteIconButton={
            <DeleteIconButton
              confirmProps={{
                description: Translation.get('feature.history.delete.prompt', {
                  start: Dayjs.format(from, 'YYYY-MM-DD'),
                  end: Dayjs.format(to, 'YYYY-MM-DD')
                }),
                onConfirm: () => {
                  clearHistory(id, from, to).then(() => {
                    if (numberedRange) fetchData(id, numberedRange);
                  });
                }
              }}
              buttonProps={{ size: 'middle', variant: 'filled' }}
            />
          }
        />
      </Col>
    </Grid>
  );
};
