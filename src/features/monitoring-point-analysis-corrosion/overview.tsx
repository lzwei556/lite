import React from 'react';
import { Col, Empty } from 'antd';
import { Translation } from 'locales/utils';
import { Card, Grid } from '../../components';
import {
  CriticalThickness,
  HistoryData,
  InitialThickness,
  MonitoringPointRow
} from '../../asset-common';
import { isCriticalThicknessValid, isInitialThicknessValid } from './useAnalysis';
import { CorrosionAttributes } from 'common';
import { PropertyValueCard } from './property-value-card';

export const Overview = (props: {
  point: MonitoringPointRow;
  history: HistoryData | undefined;
}) => {
  const { history, point } = props;
  const attributes = point.attributes as CorrosionAttributes;

  if (!history || history.length === 0) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  let initial;
  if (isInitialThicknessValid(attributes)) {
    initial = attributes?.initial_thickness;
  }
  let critical;
  if (isCriticalThicknessValid(attributes)) {
    critical = attributes?.critical_thickness;
  }
  const crt = history[history.length - 1].values[0].data['FIELD_THICKNESS'];

  const diff = history[0].values[0].data['FIELD_THICKNESS'] - crt;

  return (
    <Grid>
      <Col span={12}>
        <PropertyValueCard
          title={Translation.get(InitialThickness.label)}
          values={[{ value: initial, unit: InitialThickness.unit! }]}
        />
      </Col>
      <Col span={12}>
        <PropertyValueCard
          title={Translation.get(CriticalThickness.label)}
          values={[{ value: critical, unit: CriticalThickness.unit! }]}
        />
      </Col>
      <Col span={12}>
        <PropertyValueCard
          title={Translation.get('corrosion.analysis.forecast.thickness')}
          values={[{ value: crt, unit: 'mm' }]}
        />
      </Col>
      <Col span={12}>
        <PropertyValueCard
          title={Translation.get('corrosion.analysis.forecast.diff')}
          values={[{ value: Math.max(0, diff), unit: 'mm' }]}
        />
      </Col>
    </Grid>
  );
};
