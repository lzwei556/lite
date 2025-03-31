import React from 'react';
import { DatePicker, Descriptions, Empty, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Card } from '../../../components';
import { Dayjs } from '../../../utils';
import { getValue, roundValue } from '../../../utils/format';
import { MonitoringPointRow } from '../../asset-common';
import { getDurationByDays, Range, useAnalysisData } from './useAnalysis';

export const Forecast = ({
  point,
  range: initialRange
}: {
  point: MonitoringPointRow;
  range: Range;
}) => {
  const { id } = point;
  const [range, setRange] = React.useState(initialRange);
  const { analysisResult } = useAnalysisData(id, range);

  const render = () => {
    if (!analysisResult) {
      return (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      );
    } else {
      const { rate, life } = analysisResult;
      const { duration, unit } = getDurationByDays(life);

      return (
        <Card styles={{ body: { padding: 0 } }}>
          <Card.Grid hoverable={false} style={{ width: '50%' }}>
            <PropertyCardedContent
              label={intl.get('FIELD_CORROSION_RATE')}
              unit='mm/a'
              value={rate}
            />
          </Card.Grid>
          <Card.Grid hoverable={false} style={{ width: '50%' }}>
            <PropertyCardedContent
              label={intl.get('FIELD_RESIDUAL_LIFE')}
              unit={intl.get(unit)}
              value={duration}
            />
          </Card.Grid>
        </Card>
      );
    }
  };

  return (
    <Card className='corrosion-analysis-forecast' styles={{ body: { padding: 0 } }}>
      <Descriptions
        column={1}
        colon={false}
        bordered
        items={[
          {
            label: intl.get('corrosion.analysis.begin'),
            children: (
              <DatePicker
                allowClear={false}
                defaultValue={Dayjs.dayjs(range[0] * 1000)}
                minDate={Dayjs.dayjs(initialRange[0] * 1000)}
                maxDate={Dayjs.dayjs(initialRange[1] * 1000).endOf('day')}
                onChange={(date) => setRange((prev) => [date.utc().unix(), prev[1]])}
                variant='borderless'
              />
            )
          },
          {
            label: intl.get('corrosion.analysis.end'),
            children: (
              <span style={{ paddingLeft: 11, lineHeight: '30px' }}>
                {Dayjs.dayjs(range[1] * 1000).format('YYYY-MM-DD')}
              </span>
            )
          }
        ]}
        size='small'
      />
      {render()}
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
