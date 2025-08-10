import React from 'react';
import { Col, Collapse, Empty, Spin } from 'antd';
import intl from 'react-intl-universal';
import { Dayjs } from '../../../utils';
import { Grid } from '../../../components';
import { DisplayProperty, displayPropertyGroup } from '../../../constants/properties';
import { generateColProps } from '../../../utils/grid';
import {
  getDataOfMonitoringPoint,
  HistoryData,
  MonitoringPointRow,
  Point
} from '../../../asset-common';
import { useGlobalStyles } from '../../../styles';
import { HistoryDataFea } from '../..';
import { appendAxisAliasLabelToField } from '../common';

export const Monitor = (point: MonitoringPointRow) => {
  const { id, type, properties, attributes } = point;
  const [loading, setLoading] = React.useState(true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const colProps = generateColProps({ md: 12, lg: 12, xl: 12, xxl: 8 });
  const { propertyHistoryCardStyle, colorBgContainerStyle } = useGlobalStyles();

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
    <Collapse
      defaultActiveKey={displayPropertyGroup[0]}
      expandIconPosition='end'
      items={displayPropertyGroup.map((g) => ({
        key: g,
        label: intl.get(g),
        children: (
          <Grid>
            {Point.getPropertiesByType(type, properties)
              .map((p) => appendAxisAliasLabelToField(p, attributes))
              .filter((p) => p.group === g)
              .map((p: DisplayProperty, index: number) => {
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
        )
      }))}
      style={{ borderRadius: 0, backgroundColor: colorBgContainerStyle.backgroundColor }}
    />
  );
};
