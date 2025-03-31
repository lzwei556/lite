import * as React from 'react';
import { Button, DatePicker, Space } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import intl from 'react-intl-universal';
import { Dayjs } from '../utils';

export const RangeDatePicker = ({
  defaultValue = commonRange.PastWeek,
  onChange,
  showQuickRanges = true,
  value
}: Omit<RangePickerProps, 'defaultValue' | 'onChange'> & {
  defaultValue?: Dayjs.RangeValue;
  onChange: (range: Dayjs.RangeValue) => void;
  showQuickRanges?: boolean;
}) => {
  const { range, setRange } = useRange(defaultValue as Dayjs.RangeValue);

  const handleChange = (date: Dayjs.RangeValue) => {
    setRange(date);
    onChange(date);
  };

  return (
    <DatePicker.RangePicker
      allowClear={false}
      defaultValue={defaultValue}
      value={value ?? range}
      renderExtraFooter={() => {
        return (
          showQuickRanges && (
            <Space>
              <Button type='text' onClick={() => handleChange(commonRange.PastMonth)}>
                {intl.get('OPTION_LAST_MONTH')}
              </Button>
              <Button type='text' onClick={() => handleChange(commonRange.PastThreeMonths)}>
                {intl.get('OPTION_LAST_3_MONTHS')}
              </Button>
              <Button type='text' onClick={() => handleChange(commonRange.PastHalfYear)}>
                {intl.get('OPTION_LAST_HALF_YEAR')}
              </Button>
              <Button type='text' onClick={() => handleChange(commonRange.PastYear)}>
                {intl.get('OPTION_LAST_YEAR')}
              </Button>
            </Space>
          )
        );
      }}
      onChange={(date) => {
        if (date) {
          handleChange(date as Dayjs.RangeValue);
        }
      }}
      disabledDate={(current) => current && current > Dayjs.dayjs().endOf('day')}
    />
  );
};

export const commonRange = {
  PastWeek: getRange(6, 'days'),
  PastMonth: getRange(1, 'months'),
  PastThreeMonths: getRange(3, 'months'),
  PastHalfYear: getRange(6, 'months'),
  PastYear: getRange(1, 'years')
};

function getRange(value: number, unit: Dayjs.dayjs.ManipulateType): Dayjs.RangeValue {
  return [Dayjs.dayjs().startOf('day').subtract(value, unit), Dayjs.dayjs().endOf('day')];
}

export function useRange(initialRange?: Dayjs.RangeValue) {
  const [range, setRange] = React.useState<Dayjs.RangeValue>(initialRange ?? commonRange.PastWeek);
  return React.useMemo(
    () => ({
      range,
      numberedRange: Dayjs.toRange(range),
      setRange
    }),
    [range]
  );
}
