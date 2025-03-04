import React from 'react';
import { Col, Empty, Spin } from 'antd';
import {
  oneYearNumberRange,
  oneYearRange,
  RangeDatePicker
} from '../../../components/rangeDatePicker';
import { Card, ChartMark, Flex, Grid } from '../../../components';
import { Space } from '../../../common';
import { MonitoringPointRow, Point } from '../../asset-common';
import { Forecast } from './forecast';
import { Range, useAnalysisData } from './useAnalysis';
import { Overview } from './overview';
import { ThicknessChart } from './thicknessChart';

export const Analysis = (props: MonitoringPointRow) => {
  const [range, setRange] = React.useState<Range>(oneYearNumberRange);

  return (
    <ChartMark.Context>
      <Grid>
        <Col span={24}>
          <Card>
            <Flex>
              <RangeDatePicker onChange={setRange} defaultRange={oneYearRange} showFooter={true} />
            </Flex>
          </Card>
        </Col>
        <Col span={24}>
          <Content {...props} range={range} />
        </Col>
      </Grid>
    </ChartMark.Context>
  );
};

const Content = (props: MonitoringPointRow & { range: Range }) => {
  const { id, range, properties, type } = props;
  const { history, loading } = useAnalysisData(id, range);
  if (loading) return <Spin />;
  if (!history || history.length === 0) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }
  const _properties = Point.getPropertiesByType(properties, type);
  if (_properties.length === 0) return null;
  const property = _properties[0];

  return (
    <Grid gutter={[Space, Space]}>
      {property && (
        <Col flex='auto'>
          <ThicknessChart {...props} history={history} property={property} />
        </Col>
      )}
      <Col flex='300px'>
        <Grid>
          <Col span={24}>
            <Overview point={props} history={history} />
          </Col>
          <Col span={24}>
            <Forecast point={props} range={range} />
          </Col>
          <ChartMark.List />
        </Grid>
      </Col>
    </Grid>
  );
};
