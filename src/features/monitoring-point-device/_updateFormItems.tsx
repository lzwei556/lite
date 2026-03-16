import React from 'react';
import { Col, ColProps } from 'antd';
import { Translation } from 'locales/utils';
import { generateColProps } from '../../utils/grid';
import { Grid, NumberFormItem, SelectFormItem, TextFormItem } from '../../components';
import DeviceSelect from '../../components/select/deviceSelect';
import { Asset, MonitoringPointRow } from '../../asset-common';
import { useMonitoringPointParents } from '../../asset-variant';
import { MonitoringPointType } from 'common';

export const UpdateFormItems = ({
  monitoringPoint,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  monitoringPoint: MonitoringPointRow;
  formItemColProps?: ColProps;
}) => {
  const { type } = monitoringPoint;
  const parents = useMonitoringPointParents((asset) => Asset.Assert.isDeviceRelated(asset.type));
  const types = [{ id: type, label: MonitoringPointType.Key.getLabel(type) }];
  const deviceTypes = MonitoringPointType.Key.getDeviceTypes(type);

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
        <NumberFormItem
          label='monitoring.point.position'
          name={['attributes', 'index']}
          initialValue={1}
          rules={[{ required: true }]}
          inputNumberProps={{ min: 1 }}
        />
      </Col>
    </Grid>
  );
};
