import React from 'react';
import { Col, DatePicker, Descriptions, Empty, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Grid } from '../../../components';
import { Dayjs, getPluralUnitInEnglish } from '../../../utils';
import { getValue } from '../../../utils/format';
import { MonitoringPointRow } from '../../../asset-common';
import { useLocaleContext } from '../../../localeProvider';
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
  const { language } = useLocaleContext();

  const render = () => {
    if (!analysisResult) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    } else {
      const { rate, life } = analysisResult;
      const { duration, unit } = getDurationByDays(life);

      return (
        <Grid>
          <Col span={12}>
            <PropertyCardedContent
              label={intl.get('FIELD_CORROSION_RATE')}
              unit='mm/a'
              value={rate}
              precision={3}
            />
          </Col>
          <Col span={12}>
            <PropertyCardedContent
              label={intl.get('FIELD_RESIDUAL_LIFE')}
              unit={getPluralUnitInEnglish(duration, intl.get(unit), language)}
              value={duration}
              precision={0}
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
              label: intl.get('corrosion.analysis.begin'),
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
              label: intl.get('corrosion.analysis.end'),
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

function PropertyCardedContent({
  label,
  unit,
  value,
  precision
}: {
  label: string;
  unit: string;
  value?: number;
  precision?: number;
}) {
  return (
    <Space direction='vertical'>
      <Typography.Text type='secondary'>{label}</Typography.Text>
      <Typography.Text style={{ fontSize: 18 }}>
        {getValue({ value, precision })}
        {value !== undefined && (
          <Typography.Text style={{ marginLeft: 4 }} type='secondary'>
            {unit}
          </Typography.Text>
        )}
      </Typography.Text>
    </Space>
  );
}
