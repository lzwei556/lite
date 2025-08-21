import React from 'react';
import { Col, Empty, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Card, Grid } from '../../../components';
import { getValue } from '../../../utils/format';
import {
  CriticalThickness,
  HistoryData,
  InitialThickness,
  MonitoringPointRow
} from '../../../asset-common';
import { isCriticalThicknessValid, isInitialThicknessValid } from './useAnalysis';

export const Overview = (props: {
  point: MonitoringPointRow;
  history: HistoryData | undefined;
}) => {
  const { history, point } = props;
  const { attributes } = point;

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
        <PropertyCardedContent
          label={intl.get(InitialThickness.label)}
          unit={InitialThickness.unit!}
          value={initial}
        />
      </Col>
      <Col span={12}>
        <PropertyCardedContent
          label={intl.get(CriticalThickness.label)}
          unit={CriticalThickness.unit!}
          value={critical}
        />
      </Col>
      <Col span={12}>
        <PropertyCardedContent
          label={intl.get('corrosion.analysis.forecast.thickness')}
          unit='mm'
          value={crt}
        />
      </Col>
      <Col span={12}>
        <PropertyCardedContent
          label={intl.get('corrosion.analysis.forecast.diff')}
          unit='mm'
          value={diff < 0 ? 0 : diff}
        />
      </Col>
    </Grid>
  );
};

function PropertyCardedContent({
  label,
  unit,
  value
}: {
  label: string;
  unit: string;
  value?: number;
}) {
  return (
    <Space direction='vertical'>
      <Typography.Text type='secondary'>{label}</Typography.Text>
      <Typography.Text style={{ fontSize: 18 }}>
        {getValue({ value, precision: 3 })}
        {value !== undefined && (
          <Typography.Text style={{ marginLeft: 4 }} type='secondary'>
            {unit}
          </Typography.Text>
        )}
      </Typography.Text>
    </Space>
  );
}
