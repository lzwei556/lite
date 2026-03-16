import React from 'react';
import { Translation } from 'locales/utils';
import { Property } from '../../../types/property';
import { DeviceType } from '../../../types/device_type';
import { NumberFormItem, SelectFormItem, TextFormItem } from '../../../components';

export const SVT = ({
  typeId,
  properties: all,
  onChange
}: {
  typeId: number;
  properties: Property[];
  onChange: (axisValue: number) => void;
}) => {
  const calibratedPropertyKeys = ['acceleration_peak', 'vibration_severity'];
  const properties = all.filter((p) => calibratedPropertyKeys.includes(p.key));
  const [property, setProperty] = React.useState(properties[0]);
  const isSVT220S1 = DeviceType.SVT220S1 === typeId;
  const axisLabels = ['label.axis.x', 'label.axis.y', 'label.axis.z'];
  const axisValues = {
    [calibratedPropertyKeys[0]]: [1, 2, 3],
    [calibratedPropertyKeys[1]]: [17, 18, 19]
  };
  const axis = axisLabels.map((label, i) => ({ label, value: axisValues[property.key][i] }));

  return (
    <>
      <SelectFormItem
        label='device.command.calibration.property'
        selectProps={{
          defaultValue: property.key,
          options: properties.map((p) => ({ label: Translation.get(p.name), value: p.key })),
          onChange: (value: string) => {
            setProperty(properties.find((p) => p.key === value)!);
            onChange(axisValues[value][0]);
          }
        }}
      />
      <NumberFormItem
        label={property.name}
        name='param'
        rules={[{ required: true }]}
        inputNumberProps={{ addonAfter: property.unit }}
      />
      {!isSVT220S1 && (
        <SelectFormItem
          label='label.axis'
          name='sub_command'
          rules={[{ required: true }]}
          initialValue={axisValues[property.key][0]}
          selectProps={{
            options: axis.map(({ label, value }) => ({ label: Translation.get(label), value }))
          }}
        />
      )}
      {isSVT220S1 && <TextFormItem name={'sub_command'} hidden={true} initialValue={3} />}
    </>
  );
};
