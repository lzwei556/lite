import React from 'react';
import { Col, Empty, Spin } from 'antd';
import { Grid } from '../../../components';
import { DisplayProperty } from '../../../constants/properties';
import { generateColProps } from '../../../utils/grid';
import { Dayjs } from '../../../utils';
import {
  getDataOfMonitoringPoint,
  getSeriesAlarm,
  HistoryData,
  MonitoringPointRow,
  Point,
  useMonitoringPointContext
} from '../../../asset-common';
import { useGlobalStyles } from '../../../styles';
import { HistoryDataFea } from '../..';

export const Monitor = (point: MonitoringPointRow) => {
  const { id, type, properties } = point;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const colProps = generateColProps({ lg: 12, xl: 12, xxl: 12 });
  const { propertyHistoryCardStyle } = useGlobalStyles();
  const { ruleGroups } = useMonitoringPointContext();

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
      {Point.getPropertiesByType(type, properties).map((p: DisplayProperty, index: number) => {
        return (
          <Col {...colProps} key={index}>
            <HistoryDataFea.PropertyChartCard
              alarm={getSeriesAlarm(ruleGroups, p)}
              cardProps={propertyHistoryCardStyle}
              data={historyData}
              property={p}
            />
          </Col>
        );
      })}
    </Grid>
  );
};
