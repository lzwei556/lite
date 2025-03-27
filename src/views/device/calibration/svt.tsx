import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import intl from 'react-intl-universal';
import { Property } from '../../../types/property';
import { FormInputItem } from '../../../components/formInputItem';
import { DeviceType } from '../../../types/device_type';

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
  const axisLabels = ['AXIS_X', 'AXIS_Y', 'AXIS_Z'];
  const axisValues = {
    [calibratedPropertyKeys[0]]: [1, 2, 3],
    [calibratedPropertyKeys[1]]: [17, 18, 19]
  };
  const axis = axisLabels.map((label, i) => ({ label, value: axisValues[property.key][i] }));

  return (
    <>
      <Form.Item label={intl.get('calibrate.type')}>
        <Select
          options={properties.map((p) => ({ label: intl.get(p.name), value: p.key }))}
          onChange={(value: string) => {
            setProperty(properties.find((p) => p.key === value)!);
            onChange(axisValues[value][0]);
          }}
          defaultValue={property.key}
        />
      </Form.Item>
      <FormInputItem
        label={`${intl.get(property.name).d(property.name)}`}
        name='param'
        requiredMessage={intl.get('PLEASE_ENTER_SOMETHING', {
          something: intl.get(property.name).d(property.name)
        })}
        numericRule={{ isInteger: false }}
        numericChildren={
          <InputNumber
            controls={false}
            style={{ width: '100%' }}
            placeholder={intl.get('PLEASE_ENTER_SOMETHING', {
              something: intl.get(property.name).d(property.name)
            })}
            addonAfter={property.unit}
          />
        }
      />
      {!isSVT220S1 && (
        <Form.Item
          label={intl.get('AXIS')}
          name='sub_command'
          rules={[{ required: true, message: intl.get('PLEASE_SELECT_CHANNEL') }]}
          initialValue={axisValues[property.key][0]}
        >
          <Select>
            {axis.map(({ label, value }) => (
              <Select.Option key={value} value={value}>
                {intl.get(label)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {isSVT220S1 && (
        <Form.Item name={'sub_command'} hidden={true} initialValue={3}>
          <Input />
        </Form.Item>
      )}
    </>
  );
};
