import React from 'react';
import { Col, Empty, Spin } from 'antd';
import intl from 'react-intl-universal';
import { Card, ChartMark, Flex, Grid, RangeDatePicker, useRange } from '../../../components';
import { AnalysisSidebarCollapse } from '../..';
import { Space } from '../../../common';
import { Dayjs } from '../../../utils';
import { MonitoringPointRow, Point } from '../../../asset-common';
import { Forecast } from './forecast';
import { Range, useAnalysisData } from './useAnalysis';
import { Overview } from './overview';
import { ThicknessChart } from './thicknessChart';
import { MarkList } from './markList';

export const Analysis = (props: MonitoringPointRow) => {
  const { numberedRange, setRange } = useRange(Dayjs.CommonRange.PastYear);

  return (
    <ChartMark.Context>
      <Grid>
        <Col span={24}>
          <Card>
            <Flex>
              <RangeDatePicker onChange={setRange} defaultValue={Dayjs.CommonRange.PastYear} />
            </Flex>
          </Card>
        </Col>
        <Col span={24}>
          <Content {...props} range={numberedRange} />
        </Col>
      </Grid>
    </ChartMark.Context>
  );
};

const Content = (props: MonitoringPointRow & { range: Range }) => {
  const { id, range, properties, type } = props;
  const { history, loading } = useAnalysisData(id, range);
  const [activeKey, setActiveKey] = React.useState('overview');
  if (loading) return <Spin />;
  if (!history || history.length === 0) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }
  const _properties = Point.getPropertiesByType(type, properties);
  if (_properties.length === 0) return null;
  const property = _properties[0];

  return (
    <Grid wrap={false}>
      {property && (
        <Col flex='auto'>
          <ThicknessChart
            {...props}
            history={history}
            property={{ ...property, interval: 0.01 }}
            onDispatchMark={() => setActiveKey('marklist')}
          />
        </Col>
      )}
      <Col flex='300px'>
        <AnalysisSidebarCollapse
          accordion={true}
          activeKey={activeKey}
          items={[
            {
              key: 'overview',
              label: intl.get('OVERVIEW'),
              children: <Overview point={props} history={history} />
            },
            {
              key: 'forecast',
              label: intl.get('corrosion.analysis.forecast'),
              children: <Forecast point={props} range={range} />
            },
            {
              key: 'marklist',
              label: intl.get('mark'),
              children: <MarkList property={property} />
            }
          ]}
          onChange={(keys) => {
            setActiveKey(keys[0]);
          }}
          style={{ backgroundColor: 'transparent' }}
        />
      </Col>
    </Grid>
  );
};
