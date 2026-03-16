import React from 'react';
import { Col, DatePicker, Descriptions, Empty } from 'antd';
import { Translation } from 'locales/utils';
import { Grid } from '../../components';
import { Dayjs, formatDaysToPeriod } from '../../utils';
import { Range, useAnalysisData } from './useAnalysis';
import { MonitoringPointRow } from 'monitoring-point';
import { PropertyValueCard } from './property-value-card';

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
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    } else {
      const { rate, life } = analysisResult;
      const periods = formatDaysToPeriod(life);

      return (
        <Grid>
          <Col span={12}>
            <PropertyValueCard
              title={Translation.get('FIELD_CORROSION_RATE')}
              values={[{ value: rate, unit: 'mm/a', precision: 3 }]}
            />
          </Col>
          <Col span={12}>
            <PropertyValueCard
              title={Translation.get('FIELD_RESIDUAL_LIFE')}
              values={periods.map((p) => ({ ...p, unit: Translation.get(p.unit) }))}
            />
          </Col>
        </Grid>
      );
    }
  };
  const [start, end] = Dayjs.toRangeValue(range);
  const initialRangeValue = Dayjs.toRangeValue(initialRange);

  return (
    <Grid>
      <Col span={24}>
        <Descriptions
          column={1}
          colon={false}
          bordered
          items={[
            {
              label: Translation.get('common.begin'),
              children: (
                <DatePicker
                  allowClear={false}
                  defaultValue={start}
                  minDate={initialRangeValue[0]}
                  maxDate={initialRangeValue[1]}
                  onChange={(date) => setRange((prev) => [date.utc().unix(), prev[1]])}
                  variant='borderless'
                />
              )
            },
            {
              label: Translation.get('common.end'),
              children: (
                <span style={{ paddingLeft: 11, lineHeight: '30px' }}>
                  {end.format('YYYY-MM-DD')}
                </span>
              )
            }
          ]}
          size='small'
        />
      </Col>
      <Col span={24}>{render()}</Col>
    </Grid>
  );
};
