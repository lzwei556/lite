import React from 'react';
import { Select, Space } from 'antd';
import intl from 'react-intl-universal';
import { Card, CardProps, Term } from '../../components';
import { DisplayProperty } from '../../constants/properties';
import { useLocaleContext } from '../../localeProvider';
import { getDisplayName, getValue, roundValue } from '../../utils/format';
import { HistoryData } from '../../views/asset-common';
import { PropertyChart, transform } from './propertyChart';
import { useSize } from 'ahooks';

export const PropertyChartCard = (props: {
  data?: HistoryData;
  property: DisplayProperty;
  cardprops?: CardProps;
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const size = useSize(cardRef);

  return (
    <Card
      ref={cardRef}
      {...props.cardprops}
      title={<PropertyChartTitle {...props} parentWidth={size?.width} />}
    >
      <PropertyChart
        {...props}
        config={{
          opts: { grid: { bottom: 16 } },
          switchs: { noDataZoom: true }
        }}
        style={{ height: 240 }}
      />
    </Card>
  );
};

const PropertyChartTitle = ({
  data,
  property,
  parentWidth = 400
}: {
  data?: HistoryData;
  property: DisplayProperty;
  parentWidth?: number;
}) => {
  const { language } = useLocaleContext();
  const { name, unit, precision } = property;
  let title = `${intl.get(name).d(name)}`;
  let valueEle = null;
  const values = transform(data, property).values;
  const isSingle = values.length === 1;
  const SelectMinWidth = 110;

  if (values.length > 1) {
    title = getDisplayName({ name: title, suffix: unit, lang: language });
    valueEle = (
      <Select
        defaultValue={`${values[0].name} ${values[0].last}`}
        options={values.map((v) => ({
          label: (
            <Space>
              {v.name}
              {getValue(roundValue(v.last, precision))}
            </Space>
          ),
          value: `${v.name} ${v.last}`
        }))}
        size='small'
        style={{ minWidth: SelectMinWidth }}
        variant='filled'
      />
    );
  } else if (isSingle) {
    valueEle = getValue(roundValue(values[0].last, precision), unit);
  }

  const getMaxWidth = () => {
    const padding = 32;
    const gap = 10;
    return Math.max(140, parentWidth - padding - gap - SelectMinWidth);
  };

  return (
    <Space align='center' style={{ fontWeight: 400 }} size={isSingle ? 16 : 8}>
      <Term
        name={title}
        nameStyle={{ maxWidth: getMaxWidth() }}
        description={intl.get(`${name}_DESC`)}
        size={isSingle ? 8 : 2}
      />
      {valueEle}
    </Space>
  );
};
