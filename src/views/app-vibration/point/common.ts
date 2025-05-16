import React from 'react';
import { FormInstance } from 'antd';
import { DeviceType } from '../../../types/device_type';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from '../../../config';
import { DisplayProperty } from '../../../constants/properties';
import {
  AXIS_ALIAS,
  bindDevice,
  MonitoringPoint,
  MonitoringPointBatch,
  MonitoringPointInfo,
  MonitoringPointRow,
  unbindDevice,
  updateMeasurement
} from '../../asset-common';

export const monitoringPointTypes = [
  { id: MonitoringPointTypeValue.Vibration, label: MonitoringPointTypeText.Vibration },
  {
    id: MonitoringPointTypeValue.VibrationRotationSingleAxis,
    label: MonitoringPointTypeText.VibrationRotationSingleAxis
  },
  {
    id: MonitoringPointTypeValue.VibrationRotation,
    label: MonitoringPointTypeText.VibrationRotation
  }
];

export const relatedDeviceTypes = new Map([
  [
    MonitoringPointTypeValue.Vibration,
    [
      DeviceType.SVT220520P,
      DeviceType.SVT520C,
      DeviceType.SVT210510P,
      DeviceType.SVT510C,
      DeviceType.SVT210K
    ]
  ],
  [MonitoringPointTypeValue.VibrationRotationSingleAxis, [DeviceType.SVT220S1]],
  [
    MonitoringPointTypeValue.VibrationRotation,
    [DeviceType.SVT210S, DeviceType.SVT220S3, DeviceType.SVT510L]
  ]
]);

export function useSelectPoints(form: FormInstance<MonitoringPointBatch>) {
  const [selectedPoints, setSelectPoints] = React.useState<MonitoringPointInfo[]>([]);
  React.useEffect(() => {
    const mergeInputs = () => {
      const inputs = form.getFieldsValue();
      const points: MonitoringPointInfo[] = inputs.monitoring_points;
      let values: MonitoringPointInfo[] = selectedPoints.map((point) => ({
        ...point,
        name: point.dev_name
      }));
      if (points && points.length > 0) {
        values = selectedPoints.map(({ dev_id, dev_name }, index) => {
          const point = points.find((item) => dev_id === item.dev_id);
          if (point) {
            return point;
          } else {
            return { ...selectedPoints[index], name: dev_name };
          }
        });
      }
      form.setFieldsValue({
        monitoring_points: values
      });
    };
    mergeInputs();
  }, [form, selectedPoints]);
  return { selectedPoints, setSelectPoints };
}

export function handleSubmit(
  monitoringPoint: MonitoringPointRow,
  values: MonitoringPoint & {
    device_id: number;
  },
  onSuccess: () => void
) {
  try {
    const { id, bindingDevices } = monitoringPoint;
    const processId = 1;
    if (bindingDevices && bindingDevices.length > 0) {
      if (bindingDevices[0].id !== values.device_id) {
        //replace
        unbindDevice(id, bindingDevices[0].id).then((res) => {
          if (res.data && res.data.code === 200) {
            bindDevice(id, values.device_id, undefined, processId);
          }
        });
      }
    } else {
      bindDevice(id, values.device_id, undefined, processId);
    }
    updateMeasurement(id, values).then(() => {
      onSuccess();
    });
  } catch (error) {
    console.log(error);
  }
}

export function appendAxisAliasLabelToField(
  property: DisplayProperty,
  attrs?: MonitoringPointRow['attributes']
) {
  let fields = property.fields ?? [];
  const isMultiple = fields.length > 1;
  if (isMultiple) {
    fields = Object.values(AXIS_ALIAS).map(({ key, label }) => {
      const axisKey = attrs?.[key];
      const field = fields.find((field) => axisKey === field.key.replace(`${property.key}_`, ''))!;
      return { ...field, alias: label };
    });
  }
  return { ...property, fields } as DisplayProperty;
}
