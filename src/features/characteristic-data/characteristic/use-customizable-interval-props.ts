import { useRange } from 'components';
import React from 'react';
import { Dayjs } from 'utils';
import { useModalBindingsProps } from 'hooks';
import intl from 'react-intl-universal';
import { ButtonProps } from 'antd';
import { clearData, URLPathname, useCustomizableInterval } from '../use-services';
import { CharacteristicData } from 'common';

export type CustomizableIntervalProps = ReturnType<typeof useCustomizableInterval> & {
  urlPathname: URLPathname;
  id: number;
  name: string;
  properties: CharacteristicData.DisplayProperty[];
  getAlarm?: (property: CharacteristicData.DisplayProperty) => any;
};

export const useProps = (props: CustomizableIntervalProps) => {
  const { id, urlPathname, name, data, fetchData, initialRange, properties } = props;
  const { property, setProperty } = useSelectedProperty(properties?.[0]);
  const { range, setRange } = useRange(initialRange);

  return {
    dateRangePickerProps: {
      defaultValue: initialRange,
      onChange: (range: Dayjs.RangeValue) => {
        fetchData(id, urlPathname, Dayjs.toRange(range)).then(() => setRange(range));
      }
    },
    range,
    canOperateData: data.length > 0,
    property,
    cardProps: {
      title: name,
      extra: {
        propertySelectProps: {
          onChange: (value: string) => {
            setProperty(properties.find((item: any) => item.key === value));
          },
          properties,
          value: property?.key
        }
      }
    },
    chartProps: usePropertyChartProps({ ...props, property: property! }),
    deleteButtonProps: useDeleteButtonProps(id, urlPathname, name, range, () =>
      fetchData(id, urlPathname, Dayjs.toRange(range))
    )
  };
};

const useSelectedProperty = (initial?: CharacteristicData.DisplayProperty) => {
  const [property, setProperty] = React.useState<CharacteristicData.DisplayProperty | undefined>(
    initial
  );
  return { property, setProperty };
};

const usePropertyChartProps = (
  params: CustomizableIntervalProps & { property: CharacteristicData.DisplayProperty }
) => {
  const { property, getAlarm, ...rest } = params;
  return {
    ...rest,
    alarm: getAlarm?.(params.property),
    config: { opts: { dataZoom: [{ start: 0, end: 100 }], yAxis: { name: property.unit } } },
    property,
    style: { height: 600 }
  };
};

const useDeleteButtonProps = (
  id: number,
  urlPathname: URLPathname,
  name: string,
  range: Dayjs.RangeValue,
  onSuccess: () => void
) => {
  const [from, to] = Dayjs.toRange(range);
  return {
    confirmProps: {
      description: intl.get('DELETE_PROPERTY_DATA_PROMPT', {
        property: name,
        start: Dayjs.format(from, 'YYYY-MM-DD'),
        end: Dayjs.format(to, 'YYYY-MM-DD')
      }),
      onConfirm: () => {
        clearData(id, urlPathname, Dayjs.toRange(range)).then(onSuccess);
      }
    },
    buttonProps: { size: 'middle', variant: 'filled' } as ButtonProps
  };
};

export const useDownloadProps = (
  params: CustomizableIntervalProps & { range?: Dayjs.RangeValue }
) => {
  const [open, setOpen] = React.useState(false);
  return {
    trigger: {
      open,
      downloadIconButtonProps: { onClick: () => setOpen(true) }
    },
    modal: {
      ...params,
      ...useModalBindingsProps({
        open,
        onCancel: () => setOpen(false)
      }),
      onSuccess: () => setOpen(false)
    }
  };
};
