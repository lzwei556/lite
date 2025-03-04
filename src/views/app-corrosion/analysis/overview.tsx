import React from 'react';
import { Empty, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Card } from '../../../components';
import { getValue, roundValue } from '../../../utils/format';
import { HistoryData, MonitoringPointRow } from '../../asset-common';
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
    <Card title='总览' styles={{ body: { padding: 0 } }}>
      <Card.Grid hoverable={false} style={{ width: '50%' }}>
        <PropertyCardedContent label={intl.get('INITIAL_THICKNESS')} unit='mm' value={initial} />
      </Card.Grid>
      <Card.Grid hoverable={false} style={{ width: '50%' }}>
        <PropertyCardedContent label={intl.get('CRITICAL_THICKNESS')} unit='mm' value={critical} />
      </Card.Grid>
      <Card.Grid hoverable={false} style={{ width: '50%' }}>
        <PropertyCardedContent
          label={intl.get('corrosion.analysis.forecast.thickness')}
          unit='mm'
          value={crt}
        />
      </Card.Grid>
      <Card.Grid hoverable={false} style={{ width: '50%' }}>
        <PropertyCardedContent
          label={intl.get('corrosion.analysis.forecast.diff')}
          unit='mm'
          value={diff < 0 ? 0 : diff}
        />
      </Card.Grid>
    </Card>
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
      <Typography.Text style={{ fontSize: 18 }} strong={true}>
        {value !== undefined ? getValue(roundValue(value, 3)) : '-'}
        {value !== undefined && (
          <Typography.Text style={{ marginLeft: 4 }} type='secondary'>
            {unit}
          </Typography.Text>
        )}
      </Typography.Text>
    </Space>
  );
}
