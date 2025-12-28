import { Col, ColProps, Form, SelectProps } from 'antd';
import { SelectFormItem, TextFormItem } from 'components';
import React from 'react';
import { useFormItemBindingsProps } from 'hooks';
import { MonitoringPointType } from 'common';
import { App, useAppType } from 'config';
import intl from 'react-intl-universal';
import { DeviceSelect } from './device-select';
import { generateColProps } from 'utils/grid';
import { useAssets, useType } from './use-basic-form-items';

export const FormItemsBasic = ({
  assetSelectFormItem,
  formItemColProps = generateColProps({}),
  sensorSelectFormItem,
  typeSelectFormItem
}: {
  assetSelectFormItem?: React.ReactElement;
  formItemColProps?: ColProps;
  sensorSelectFormItem: React.ReactElement;
  typeSelectFormItem: React.ReactElement;
}) => {
  return (
    <>
      <Col {...formItemColProps}>
        <TextFormItem
          {...useFormItemBindingsProps({
            label: 'NAME',
            name: 'name',
            rules: [{ required: true }, { min: 4, max: 50 }]
          })}
        />
      </Col>
      <Col {...formItemColProps}>{typeSelectFormItem}</Col>
      <Col {...formItemColProps}>{sensorSelectFormItem}</Col>
      {assetSelectFormItem}
    </>
  );
};

export const TypeSelectFormItem = (param: Omit<ReturnType<typeof useType>, 'selectedType'>) => {
  const appType = useAppType();
  const types = App.getMonitoringPointTypes(appType);
  const form = Form.useFormInstance();
  return (
    <>
      <SelectFormItem
        {...{
          ...useFormItemBindingsProps({
            label: 'TYPE',
            name: 'type',
            rules: [{ required: true }]
          }),
          selectProps: {
            ...param,
            onChange: (value, opt?: NonNullable<SelectProps['options']>[number]) => {
              param.onChange(value);
              form.setFieldValue('typeLabel', opt?.label);
              form.setFieldValue('device_id', null);
            },
            options: types.map((t) => ({ ...t, label: intl.get(t.label) }))
          }
        }}
      />
      <TextFormItem {...useFormItemBindingsProps({ name: 'typeLabel', hidden: true })} />
    </>
  );
};

export const SensorSelectFormItem = ({ type }: { type?: number }) => {
  const form = Form.useFormInstance();
  return (
    <>
      <TextFormItem
        {...useFormItemBindingsProps({
          label: 'SENSOR',
          name: 'device_id',
          rules: [{ required: true }]
        })}
      >
        <DeviceSelect
          onChange={(_, opt?: NonNullable<SelectProps['options']>[number]) => {
            form.setFieldValue('deviceName', opt?.label);
          }}
          types={type ? MonitoringPointType.Key.getDeviceTypes(type) : []}
        />
      </TextFormItem>
      <TextFormItem {...useFormItemBindingsProps({ name: 'deviceName', hidden: true })} />
    </>
  );
};

export const AssetSelectFormItem = ({
  formItemColProps = generateColProps({}),
  ...rest
}: {
  assetId?: number;
  formItemColProps?: ColProps;
  type?: number;
}) => {
  const assets = useAssets(rest);
  const formItemProps = useFormItemBindingsProps({
    label: 'ASSET',
    name: 'asset_id',
    rules: [{ required: true }],
    hidden: !!rest.assetId
  });
  const formItem = (
    <SelectFormItem
      {...{
        ...formItemProps,
        selectProps: {
          options: assets.map((asset) => ({ label: asset.name, value: asset.id }))
        }
      }}
    />
  );
  return rest.assetId ? formItem : <Col {...formItemColProps}>{formItem}</Col>;
};
