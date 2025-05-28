import React from 'react';
import { Col, Empty, Spin } from 'antd';
import intl from 'react-intl-universal';
import {
  Card,
  ChartMark,
  commonRange,
  Flex,
  Grid,
  RangeDatePicker,
  useRange
} from '../../../components';
import { Space } from '../../../common';
import { MonitoringPointRow, Point } from '../../asset-common';
import { Forecast } from './forecast';
import { Range, useAnalysisData } from './useAnalysis';
import { Overview } from './overview';
import { ThicknessChart } from './thicknessChart';
import { AnalysisSidebarCollapse } from '../../../features';

export const Analysis = (props: MonitoringPointRow) => {
  const { numberedRange, setRange } = useRange();

  return (
    <ChartMark.Context>
      <Grid>
        <Col span={24}>
          <Card>
            <Flex>
              <RangeDatePicker onChange={setRange} defaultValue={commonRange.PastYear} />
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
  const _properties = Point.getPropertiesByType(properties, type);
  if (_properties.length === 0) return null;
  const property = _properties[0];

  return (
    <Grid gutter={[Space, Space]}>
      {property && (
        <Col flex='auto'>
          <ThicknessChart
            {...props}
            history={history}
            property={property}
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
              children: <Overview point={props} history={history} />,
              style: { border: 0 }
            },
            {
              key: 'forecast',
              label: intl.get('corrosion.analysis.forecast'),
              children: <Forecast point={props} range={range} />,
              style: { border: 0 }
            },
            {
              key: 'marklist',
              label: intl.get('mark'),
              children: <ChartMark.List />,
              style: { border: 0 },
              styles: { body: { borderTop: 'solid 1px #f0f0f0' } }
            }
          ]}
          onChange={(keys) => {
            setActiveKey(keys[0]);
          }}
        />
      </Col>
    </Grid>
  );
};
