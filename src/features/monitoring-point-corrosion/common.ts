import React from 'react';
import { FormInstance } from 'antd';
import {
  bindDevice,
  MonitoringPoint,
  MonitoringPointBatch,
  MonitoringPointInfo,
  MonitoringPointRow,
  unbindDevice,
  updateMeasurement
} from '../../views/asset-common';
import { DeviceType } from '../../types/device_type';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from '../../config';

export const monitoringPointTypes = [
  { id: MonitoringPointTypeValue.Corrosion, label: MonitoringPointTypeText.Corrosion },
  {
    id: MonitoringPointTypeValue.HighTemperatureCorrosion,
    label: MonitoringPointTypeText.HighTemperatureCorrosion
  },
  {
    id: MonitoringPointTypeValue.UltraHighTemperatureCorrosion,
    label: MonitoringPointTypeText.UltraHighTemperatureCorrosion
  }
];

export const relatedDeviceTypes = new Map([
  [MonitoringPointTypeValue.Corrosion, DeviceType.getDCSensors()],
  [MonitoringPointTypeValue.HighTemperatureCorrosion, DeviceType.getHighDCSensors()],
  [MonitoringPointTypeValue.UltraHighTemperatureCorrosion, DeviceType.getUltraHighDCSensors()]
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
    const processId = 11;
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
    updateMeasurement(id, {
      ...values,
      attributes: resolveAttrs(values.attributes)
    }).then(() => {
      onSuccess();
    });
  } catch (error) {
    console.log(error);
  }
}

// convert 'initial_thickness: { enabled: true; value: 5 }' to 'initial_thickness_enabled: true' and 'initial_thickness: 5'
export const resolveAttrs = (attributes: any) => {
  if (attributes) {
    const { critical_thickness, initial_thickness, ...rest } = attributes;
    let attr = { ...rest };
    if (critical_thickness) {
      attr = {
        ...attr,
        critical_thickness_enabled: critical_thickness.enabled
      };
      if (critical_thickness.value) {
        attr = { ...attr, critical_thickness: critical_thickness.value };
      }
    }
    if (initial_thickness) {
      attr = {
        ...attr,
        initial_thickness_enabled: initial_thickness.enabled
      };
      if (initial_thickness.value) {
        attr = { ...attr, initial_thickness: initial_thickness.value };
      }
    }
    return attr;
  }
  return attributes;
};

export const parseAttrs = (attributes: MonitoringPointRow['attributes']) => {
  let attr = null;
  if (attributes) {
    const {
      critical_thickness,
      critical_thickness_enabled,
      initial_thickness,
      initial_thickness_enabled,
      ...rest
    } = attributes;
    attr = {
      ...rest,
      critical_thickness: {
        enabled: critical_thickness_enabled,
        value: critical_thickness
      },
      initial_thickness: {
        enabled: initial_thickness_enabled,
        value: initial_thickness
      }
    };
  }

  return attr ?? attributes;
};
