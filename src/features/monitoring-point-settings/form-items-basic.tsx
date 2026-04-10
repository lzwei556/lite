import { Col, ColProps, Form, SelectProps } from 'antd';
import { SelectFormItem, TextFormItem } from 'components';
import React from 'react';
import { useFormItemBindingsProps } from 'hooks';
import intl from 'react-intl-universal';
import { DeviceSelect } from './device-select';
import { generateColProps } from 'utils/grid';
import { useAssets, useType } from './use-basic-form-items';
import { useComponents } from './hooks';
import * as MonitoringPoint from 'domain/monitoring-point';
import { PrimaryAsset } from 'domain/asset';

export const FormItemsBasic = ({
  assetSelectFormItem,
  formItemColProps = generateColProps({}),
  sensorSelectFormItem,
  typeSelectFormItem,
  componentSelectFormItem
}: {
  assetSelectFormItem?: React.ReactElement;
  formItemColProps?: ColProps;
  sensorSelectFormItem: React.ReactElement;
  typeSelectFormItem: React.ReactElement;
  componentSelectFormItem?: React.ReactNode;
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
      {componentSelectFormItem && <Col {...formItemColProps}>{componentSelectFormItem}</Col>}
    </>
  );
};

export const TypeSelectFormItem = (
  param: Omit<ReturnType<typeof useType>, 'selectedType'> & { primaryAssetType: PrimaryAsset.Enum }
) => {
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
            options: PrimaryAsset.getMonitoringPointTypes([param.primaryAssetType]).map((type) => ({
              label: intl.get(MonitoringPoint.Type.getLabel(type)),
              value: type
            }))
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
          types={type ? MonitoringPoint.Type.getDeviceTypes(type) : []}
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

export const ComponentSelectFormItem = ({ type }: { type: number }) => {
  return (
    <SelectFormItem
      label='common.component'
      name='component_id'
      rules={[{ required: true }]}
      selectProps={{
        options: useComponents(type).map((opt) => ({
          ...opt,
          value: opt.key,
          label: intl.get(opt.label)
        }))
      }}
    />
  );
};
