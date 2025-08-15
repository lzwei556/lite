import * as React from 'react';
import { Button, DatePicker, Space } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import intl from 'react-intl-universal';
import { Dayjs } from '../utils';

export const RangeDatePicker = ({
  defaultValue = Dayjs.CommonRange.PastWeek,
  onChange,
  showQuickRanges = true,
  value,
  ...rest
}: Omit<RangePickerProps, 'defaultValue' | 'onChange'> & {
  defaultValue?: Dayjs.RangeValue;
  onChange: (range: Dayjs.RangeValue) => void;
  showQuickRanges?: boolean;
}) => {
  const [range, setRange] = React.useState(defaultValue);
  const handleChange = (date: Dayjs.RangeValue) => {
    onChange(date);
    setRange(date);
  };
  return (
    <DatePicker.RangePicker
      {...rest}
      allowClear={false}
      defaultValue={defaultValue}
      value={value ?? range}
      renderExtraFooter={() => {
        return (
          showQuickRanges && (
            <Space>
              <Button type='text' onClick={() => handleChange(Dayjs.CommonRange.PastMonth)}>
                {intl.get('OPTION_LAST_MONTH')}
              </Button>
              <Button type='text' onClick={() => handleChange(Dayjs.CommonRange.PastThreeMonths)}>
                {intl.get('OPTION_LAST_3_MONTHS')}
              </Button>
              <Button type='text' onClick={() => handleChange(Dayjs.CommonRange.PastHalfYear)}>
                {intl.get('OPTION_LAST_HALF_YEAR')}
              </Button>
              <Button type='text' onClick={() => handleChange(Dayjs.CommonRange.PastYear)}>
                {intl.get('OPTION_LAST_YEAR')}
              </Button>
            </Space>
          )
        );
      }}
      onChange={(date) => {
        if (date) {
          const [start, end] = date;
          if (start && end) {
            handleChange([start.startOf('day'), end.endOf('day')]);
          }
        }
      }}
      disabledDate={(current) => current && current > Dayjs.dayjs().endOf('day')}
    />
  );
};

export function useRange(initialRange?: Dayjs.RangeValue) {
  const [range, setRange] = React.useState<Dayjs.RangeValue>(
    initialRange ?? Dayjs.CommonRange.PastWeek
  );
  return React.useMemo(
    () => ({
      range,
      numberedRange: Dayjs.toRange(range),
      setRange
    }),
    [range]
  );
}
