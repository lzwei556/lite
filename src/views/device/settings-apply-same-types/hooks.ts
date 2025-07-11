import React from 'react';
import { Form } from 'antd';
import { Device } from '../../../types/device';
import { DeviceType } from '../../../types/device_type';
import { UpdateDeviceSettingRequest } from '../../../apis/device';
import { transformSettings } from '../settings-common';
import { useContext } from '..';

export const useOthersWithSameTypes = (device: Device) => {
  const { devices } = useContext();
  return devices.filter((d) => d.typeId === device.typeId && d.id !== device.id);
};

export const useProps = (deviceIds: number[]) => {
  const [form] = Form.useForm();
  const [prevIds, setPrevIds] = React.useState<number[]>([]);
  const indeterminate =
    prevIds.filter((id) => id !== 0).length > 0 &&
    prevIds.filter((id) => id !== 0).length < deviceIds.length;
  const onChange = (e: number[]) => {
    let ids: number[] = [];
    if (prevIds.includes(0)) {
      if (!e.includes(0) || (e.length === 1 && e[0] === 0)) {
        ids = [];
      } else {
        ids = e;
      }
    } else {
      if (e.includes(0) || e.length === deviceIds.length) {
        ids = [0, ...deviceIds];
      } else {
        ids = e;
      }
    }
    form.setFieldsValue({ ids });
    setPrevIds(ids);
  };
  return { form, ids: prevIds, indeterminate, onChange };
};

export const useUpdateSettingsWithSameTypes = ({
  id,
  settings,
  onSuccess
}: {
  id: number;
  settings: any;
  onSuccess?: () => void;
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (values: { ids: number[] }) => {
    if (values.ids.length > 0 && settings) {
      setLoading(true);
      UpdateDeviceSettingRequest(
        id,
        {
          ...settings,
          sensors: transformSettings(settings.sensors)
        },
        values.ids.filter((id) => id !== 0)
      )
        .then(() => {
          onSuccess?.();
        })
        .finally(() => setLoading(false));
    }
  };

  return { loading, handleSubmit };
};

export const useSameTypeSettingsModalProps = (device: Device) => {
  const devices = useOthersWithSameTypes(device);
  const [open, setOpen] = React.useState(false);
  const [submitedValues, setSubmitedValues] = React.useState<any>();
  const can =
    devices.length > 0 &&
    DeviceType.isSensor(device.typeId) &&
    !DeviceType.isMultiChannel(device.typeId);
  return { can, open, setOpen, submitedValues, setSubmitedValues };
};
