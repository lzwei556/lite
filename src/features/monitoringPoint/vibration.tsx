import { Col, ColProps } from 'antd';
import intl from 'react-intl-universal';
import { AXIS, AXIS_OPTIONS } from '../../monitoring-point';
import { Field } from '../../types';
import { SelectFormItem, TextFormItem } from '../../components';
import React from 'react';
import { Device } from '../../types/device';
import { relatedDeviceTypes } from '../monitoring-point-vibration/common';
import { GetDevicesRequest } from '../../apis/device';

type VibrationEntity = {
  position: string;
  direction_axial: string;
  direction_vertical: string;
  direction_horizontal: string;
};

export const FormItems = ({
  monitoringPoint,
  formItemColProps
}: {
  monitoringPoint: { key: string; name: string; type: number };
  formItemColProps: ColProps;
}) => {
  const [devices, setDevices] = React.useState<Device[]>([]);
  const { name, type, key } = monitoringPoint;

  React.useEffect(() => {
    const deviceTypes = relatedDeviceTypes.get(type);
    if (deviceTypes) GetDevicesRequest({ types: deviceTypes.join(',') }).then(setDevices);
  }, [type]);

  const options = AXIS_OPTIONS.map((o) => ({ label: intl.get(o.label), value: o.key }));

  const axial: Field<VibrationEntity> = {
    label: 'direction.axial',
    name: 'direction_axial',
    description: 'direction.axial.desc',
    options
  };
  const vertical: Field<VibrationEntity> = {
    label: 'direction.vertical',
    name: 'direction_vertical',
    description: 'direction.vertical.desc',
    options
  };
  const horizontal: Field<VibrationEntity> = {
    label: 'direction.horizontal',
    name: 'direction_horizontal',
    description: 'direction.horizontal.desc',
    options
  };
  return (
    <>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='SENSOR'
          name={['monitoringPoints', key, 'sensor']}
          selectProps={{ options: devices.map(({ id, name }) => ({ label: name, value: id })) }}
        />
      </Col>
      <Col {...formItemColProps}>
        <TextFormItem hidden={true} name={['monitoringPoints', key, 'name']} initialValue={name} />
        <TextFormItem hidden={true} name={['monitoringPoints', key, 'type']} initialValue={type} />
        <SelectFormItem
          label={axial.label}
          name={['monitoringPoints', key, 'attributes', axial.name]}
          selectProps={{ options: axial.options }}
          initialValue={AXIS.Z.key}
        />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label={vertical.label}
          name={['monitoringPoints', key, 'attributes', vertical.name]}
          selectProps={{ options: vertical.options }}
          initialValue={AXIS.Y.key}
        />
      </Col>
      <Col {...formItemColProps}>
        <SelectFormItem
          label={horizontal.label}
          name={['monitoringPoints', key, 'attributes', horizontal.name]}
          selectProps={{ options: horizontal.options }}
          initialValue={AXIS.X.key}
        />
      </Col>
    </>
  );
};
