import React from 'react';
import { Col, ColProps } from 'antd';
import { Translation } from 'locales/utils';
import { Grid, SelectFormItem, TextFormItem } from '../../components';
import DeviceSelect from '../../components/select/deviceSelect';
import { Asset, MonitoringPointRow } from '../../asset-common';
import { useMonitoringPointParents } from '../../asset-variant';
import { MonitoringPointType } from 'common';
import { useComponents } from './common';

export const BasisFormItems = ({
  formItemColProps,
  monitoringPoint
}: {
  formItemColProps: ColProps;
  monitoringPoint: MonitoringPointRow;
}) => {
  const { type } = monitoringPoint;
  const parents = useMonitoringPointParents((asset) => Asset.Assert.isVibrationRelated(asset.type));
  const types = [{ id: type, label: MonitoringPointType.Key.getLabel(type) }];
  const deviceTypes = MonitoringPointType.Key.getDeviceTypes(type);
  const components = useComponents(type);

  return (
    <Grid>
      <Col {...formItemColProps}>
        <TextFormItem
          label='common.name'
          name='name'
          rules={[{ required: true }, { min: 4, max: 50 }]}
        />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='common.type'
          name='type'
          rules={[{ required: true }]}
          selectProps={{
            disabled: true,
            options: types.map(({ id, label }) => ({ label: Translation.get(label), value: id }))
          }}
        />
      </Col>
      <Col {...formItemColProps}>
        <TextFormItem label='device.sensor' name='device_id' rules={[{ required: true }]}>
          <DeviceSelect filters={{ types: deviceTypes?.join(',') }} />
        </TextFormItem>
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='asset'
          name='asset_id'
          rules={[{ required: true }]}
          selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
        />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='asset.component'
          name='component_id'
          rules={[{ required: true }]}
          selectProps={{
            options: components.map((opt) => ({
              ...opt,
              value: opt.key,
              label: Translation.get(opt.label)
            }))
          }}
        />
      </Col>
    </Grid>
  );
};
