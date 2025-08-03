import React from 'react';
import { Col, ColProps } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../utils/grid';
import { Grid, NumberFormItem, SelectFormItem, TextFormItem } from '../../components';
import DeviceSelect from '../../components/select/deviceSelect';
import { Asset, MonitoringPointRow, Point } from '../../asset-common';
import { getRelatedDeviceTypes } from './common';
import { useMonitoringPointParents } from '../../asset-variant';

export const UpdateFormItems = ({
  monitoringPoint,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  monitoringPoint: MonitoringPointRow;
  formItemColProps?: ColProps;
}) => {
  const { type } = monitoringPoint;
  const parents = useMonitoringPointParents((asset) => Asset.Assert.isDeviceRelated(asset.type));
  const types = [{ id: type, label: Point.getTypeLabel(type) as string }];
  const deviceTypes = getRelatedDeviceTypes(type);

  return (
    <Grid>
      <Col {...formItemColProps}>
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='TYPE'
          name='type'
          rules={[{ required: true }]}
          selectProps={{
            disabled: true,
            options: types.map(({ id, label }) => ({ label: intl.get(label), value: id }))
          }}
        />
      </Col>
      <Col {...formItemColProps}>
        <TextFormItem label='SENSOR' name='device_id' rules={[{ required: true }]}>
          <DeviceSelect filters={{ types: deviceTypes?.join(',') }} />
        </TextFormItem>
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='ASSET'
          name='asset_id'
          rules={[{ required: true }]}
          selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
        />
      </Col>
      <Col {...formItemColProps}>
        <NumberFormItem
          label='POSITION'
          name={['attributes', 'index']}
          initialValue={1}
          rules={[{ required: true }]}
          inputNumberProps={{ min: 1 }}
        />
      </Col>
    </Grid>
  );
};
