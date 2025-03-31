import React from 'react';
import { Col, Empty, Spin } from 'antd';
import { Card, Grid, commonRange } from '../../../../components';
import { DisplayProperty } from '../../../../constants/properties';
import { generateColProps } from '../../../../utils/grid';
import { Dayjs } from '../../../../utils';
import { HistoryDataFea } from '../../../../features';
import {
  getDataOfMonitoringPoint,
  HistoryData,
  MonitoringPointRow,
  Point
} from '../../../asset-common';

export const Monitor = (point: MonitoringPointRow) => {
  const { id, type, properties } = point;
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
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );

  return (
    <Grid>
      {Point.getPropertiesByType(properties, type).map((p: DisplayProperty, index: number) => {
        return (
          <Col {...colProps} key={index}>
            <HistoryDataFea.PropertyChartCard data={historyData} property={p} />
          </Col>
        );
      })}
    </Grid>
  );
};
