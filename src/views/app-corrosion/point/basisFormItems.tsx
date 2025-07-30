import React from 'react';
import { Col, ColProps } from 'antd';
import intl from 'react-intl-universal';
import DeviceSelect from '../../../components/select/deviceSelect';
import { Grid, NumberFormItem, SelectFormItem, TextFormItem } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import { Asset, MonitoringPointRow, Point } from '../../asset-common';
import { useMonitoringPointParents } from '../../asset-variant';
import { relatedDeviceTypes } from './common';

export const BasisFormItems = ({
  monitoringPoint,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  monitoringPoint: MonitoringPointRow;
  formItemColProps?: ColProps;
}) => {
  const { type } = monitoringPoint;
  const parents = useMonitoringPointParents((asset) => Asset.Assert.isCorrosionRelated(asset.type));

  const types = [{ id: type, label: Point.getTypeLabel(type) as string }];
  const deviceTypes = relatedDeviceTypes.get(type);

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
          rules={[{ required: true }]}
        />
      </Col>
    </Grid>
  );
};
