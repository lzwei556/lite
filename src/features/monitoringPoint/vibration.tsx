import { Col, ColProps } from 'antd';
import { Translation } from 'locales/utils';
import { AXIS, AXIS_OPTIONS } from '../../monitoring-point';
import { Field } from '../../types';
import { SelectFormItem, TextFormItem } from '../../components';
import React from 'react';
import { Device } from '../../types/device';
import { GetDevicesRequest } from '../../apis/device';
import { MonitoringPointType } from 'common';

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
    const deviceTypes = MonitoringPointType.Key.getDeviceTypes(type);
    if (deviceTypes) GetDevicesRequest({ types: deviceTypes.join(',') }).then(setDevices);
  }, [type]);

  const options = AXIS_OPTIONS.map((o) => ({ label: Translation.get(o.label), value: o.key }));

  const axial: Field<VibrationEntity> = {
    label: 'monitoring.point.direction.axial',
    name: 'direction_axial',
    description: 'monitoring.point.direction.axial.desc',
    options,
    type: 'enum'
  };
  const vertical: Field<VibrationEntity> = {
    label: 'monitoring.point.direction.vertical',
    name: 'direction_vertical',
    description: 'monitoring.point.direction.vertical.desc',
    options,
    type: 'enum'
  };
  const horizontal: Field<VibrationEntity> = {
    label: 'monitoring.point.direction.horizontal',
    name: 'direction_horizontal',
    description: 'monitoring.point.direction.horizontal.desc',
    options,
    type: 'enum'
  };
  return (
    <>
      <Col {...formItemColProps}>
        <SelectFormItem
          label='device.sensor'
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
