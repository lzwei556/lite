import React from 'react';
import { Col, Collapse, Empty, Spin } from 'antd';
import intl from 'react-intl-universal';
import { Card, Grid } from '../../../../components';
import { oneWeekNumberRange } from '../../../../components/rangeDatePicker';
import { DisplayProperty, displayPropertyGroup } from '../../../../constants/properties';
import { generateColProps } from '../../../../utils/grid';
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
    const [from, to] = oneWeekNumberRange;
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
    <Card>
      <Collapse
        defaultActiveKey={displayPropertyGroup[0]}
        expandIconPosition='end'
        items={displayPropertyGroup.map((g) => ({
          key: g,
          label: intl.get(g),
          children: (
            <Grid>
              {Point.getPropertiesByType(properties, type)
                .filter((p) => p.group === g)
                .map((p: DisplayProperty, index: number) => {
                  return (
                    <Col {...colProps} key={index}>
                      <HistoryDataFea.PropertyChartCard data={historyData} property={p} />
                    </Col>
                  );
                })}
            </Grid>
          )
        }))}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.01)' }}
      />
    </Card>
  );
};
