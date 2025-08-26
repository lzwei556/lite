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

  const getCols = (propertyNums: number) => {
    if (propertyNums < 3) {
      return generateColProps({
        md: 24 / propertyNums,
        lg: 24 / propertyNums,
        xl: 24 / propertyNums,
        xxl: 24 / propertyNums
      });
    } else {
      return generateColProps({ lg: 12, xl: 12, xxl: 12 });
    }
  };

  return (
    <Grid>
      {Point.getPropertiesByType(type, properties).map((p: DisplayProperty, index: number) => {
        return (
          <Col {...getCols(properties.length)} key={index}>
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
