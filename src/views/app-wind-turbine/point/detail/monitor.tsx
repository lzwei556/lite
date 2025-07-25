import React from 'react';
import { Col, Empty, Spin } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../../utils/grid';
import { Card, Grid, commonRange } from '../../../../components';
import { DisplayProperty } from '../../../../constants/properties';
import { HistoryDataFea } from '../../../../features';
import {
  getDataOfMonitoringPoint,
  HistoryData,
  MonitoringPointRow,
  Point
} from '../../../asset-common';
import * as Tower from '../../tower';
import { Dayjs } from '../../../../utils';

export const Monitor = (point: MonitoringPointRow) => {
  const { id, name, type, attributes, properties } = point;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const colProps = generateColProps({ md: 12, lg: 12, xl: 8, xxl: 6 });

  React.useEffect(() => {
    const [from, to] = Dayjs.toRange(commonRange.PastWeek);
    getDataOfMonitoringPoint(id, from, to).then((data) => {
      setLoading(false);
      if (data.length > 0) {
        setHistoryData(data);
      } else {
        setHistoryData(undefined);
      }
    });
  }, [id, type]);

  if (loading) return <Spin />;
  if (!historyData || historyData.length === 0)
    return (
      <Card>
        <Empty description={intl.get('NO_DATA_PROMPT')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );

  return (
    <Grid>
      {Point.Assert.isTowerRelated(type) && (
        <Col {...colProps}>
          <Tower.PointsScatterChart
            data={[
              {
                name,
                history: historyData,
                height: attributes?.tower_install_height,
                radius: attributes?.tower_base_radius
              }
            ]}
            style={{ height: 240 }}
            cardProps={{ style: { background: '#f0f0f0' } }}
            type={type}
          />
        </Col>
      )}
      {Point.getPropertiesByType(properties, type).map((p: DisplayProperty, index: number) => {
        return (
          <Col {...colProps} key={index}>
            <HistoryDataFea.PropertyChartCard
              data={historyData}
              property={p}
              cardprops={{ style: { background: '#f0f0f0' } }}
            />
          </Col>
        );
      })}
    </Grid>
  );
};
