import React from 'react';
import { Col, Collapse, Empty, Spin } from 'antd';
import intl from 'react-intl-universal';
import { Dayjs } from '../../../utils';
import { Grid } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import {
  getDataOfMonitoringPoint,
  getSeriesAlarm,
  HistoryData,
  MonitoringPointRow,
  useMonitoringPointContext
} from '../../../asset-common';
import { useGlobalStyles } from '../../../styles';
import { HistoryDataFea } from '../..';
import { CharacteristicData, MonitoringPointType } from 'common';
import { getGroupedProperties } from 'common/characteristic-data';

export const Monitor = (point: MonitoringPointRow) => {
  const { id, type, properties, attributes } = point;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const colProps = generateColProps({ lg: 12, xl: 12, xxl: 12 });
  const { propertyHistoryCardStyle, colorBgContainerStyle } = useGlobalStyles();
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
  const groups = getGroupedProperties(MonitoringPointType.Key.getProperties(type, properties));

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={groups[0][0]}
      expandIconPosition='end'
      items={groups.map(([g, properties]) => ({
        key: g,
        label: intl.get(g),
        children: (
          <Grid>
            {properties
              .map((p) => CharacteristicData.appendAxisAliasAbbrToField(p, attributes))
              .map((p: CharacteristicData.DisplayProperty, index: number) => {
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
        )
      }))}
      style={{ borderRadius: 0, backgroundColor: colorBgContainerStyle.backgroundColor }}
    />
  );
};
