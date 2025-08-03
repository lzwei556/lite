import React from 'react';
import { FormInstance } from 'antd';
import { DeviceType } from '../../types/device_type';
import { MonitoringPointTypeText, MonitoringPointTypeValue } from '../../config';
import {
  AssetRow,
  bindDevice,
  MonitoringPoint,
  MonitoringPointBatch,
  MonitoringPointInfo,
  MonitoringPointRow,
  unbindDevice,
  updateMeasurement
} from '../../asset-common';
import { device } from '../../asset-variant';

export function getMonitoringPointTypes() {
  return [
    { id: MonitoringPointTypeValue.Pressure, label: MonitoringPointTypeText.Pressure },
    { id: MonitoringPointTypeValue.Temperature, label: MonitoringPointTypeText.Temperature }
  ];
}

export function isParentValid(asset?: AssetRow) {
  const type = asset?.type;
  return type && type === device.type;
}

export const getRelatedDeviceTypes = (type: number) => {
  const relatedDeviceTypes = new Map([
    [MonitoringPointTypeValue.Pressure, [DeviceType.SPT510]],
    [MonitoringPointTypeValue.Temperature, [DeviceType.ST100, DeviceType.ST101L, DeviceType.ST101S]]
  ]);
  return relatedDeviceTypes.get(type);
};

export function useSelectPoints(form: FormInstance<MonitoringPointBatch>, channelName?: string) {
  const [selectedPoints, setSelectPoints] = React.useState<MonitoringPointInfo[]>([]);
  React.useEffect(() => {
    const mergeInputs = () => {
      const inputs = form.getFieldsValue();
      const points: MonitoringPointInfo[] = inputs.monitoring_points;
      let values: MonitoringPointInfo[] = selectedPoints.map((point) => ({
        ...point,
        name: getPointName(point.dev_name, point.channel, channelName)
      }));
      if (points && points.length > 0) {
        values = selectedPoints.map(({ dev_id, dev_name, channel }, index) => {
          const point = points.find(
            (item) => dev_id === item.dev_id && (item.channel ?? 0) === channel
          );
          if (point) {
            return point;
          } else {
            return { ...selectedPoints[index], name: getPointName(dev_name, channel, channelName) };
          }
        });
      }
      form.setFieldsValue({
        monitoring_points: values
      });
    };
    mergeInputs();
  }, [form, selectedPoints, channelName]);
  return { selectedPoints, setSelectPoints };
}

function getPointName(name: string, channel?: number, channelName?: string) {
  return `${name}${channel ? `-${channelName}${channel}` : ''}`;
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
    const processId = getProcessId();
    if (bindingDevices && bindingDevices.length > 0) {
      if (
        bindingDevices[0].id !== values.device_id ||
        (values.channel && values.channel !== bindingDevices[0].channel)
      ) {
        //replace
        unbindDevice(id, bindingDevices[0].id).then((res) => {
          if (res.data && res.data.code === 200) {
            bindDevice(id, values.device_id, values.channel, processId);
          }
        });
      }
    } else {
      bindDevice(id, values.device_id, values.channel, processId);
    }
    updateMeasurement(id, values).then(() => {
      onSuccess();
    });
  } catch (error) {
    console.log(error);
  }
}

export function getProcessId() {
  return 1;
}
