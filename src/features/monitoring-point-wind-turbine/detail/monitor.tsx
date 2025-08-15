import React from 'react';
import { Col, Empty, Spin } from 'antd';
import { generateColProps } from '../../../utils/grid';
import { Grid } from '../../../components';
import { DisplayProperty } from '../../../constants/properties';
import {
  getDataOfMonitoringPoint,
  HistoryData,
  MonitoringPointRow,
  Point
} from '../../../asset-common';
import { Dayjs } from '../../../utils';
import { useGlobalStyles } from '../../../styles';
import * as Tower from '../../asset-wind-turbine/tower';
import { HistoryDataFea } from '../..';

export const Monitor = (point: MonitoringPointRow) => {
  const { id, name, type, attributes, properties } = point;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const colProps = generateColProps({ lg: 12, xl: 12, xxl: 12 });
  const { propertyHistoryCardStyle } = useGlobalStyles();

  React.useEffect(() => {
    const [from, to] = Dayjs.toRange(Dayjs.CommonRange.PastWeek);
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
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

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
            cardProps={propertyHistoryCardStyle}
            type={type}
          />
        </Col>
      )}
      {Point.getPropertiesByType(type, properties).map((p: DisplayProperty, index: number) => {
        return (
          <Col {...colProps} key={index}>
            <HistoryDataFea.PropertyChartCard
              data={historyData}
              property={p}
              cardProps={propertyHistoryCardStyle}
            />
          </Col>
        );
      })}
    </Grid>
  );
};
