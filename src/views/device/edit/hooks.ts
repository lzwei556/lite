import React from 'react';
import { UpdateDeviceRequest, UpdateDeviceSettingRequest } from '../../../apis/device';
import { UpdateNetworkRequest } from '../../../apis/network';
import { Network } from '../../../types/network';
import { transformSettings } from '../settings-common';

export const useUpdate = (id: number, onUpdate?: () => void) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (values: any) => {
    if (values) {
      setLoading(true);
      UpdateDeviceRequest(id, values)
        .then((_) => {
          onUpdate?.();
        })
        .finally(() => setLoading(false));
    }
  };

  return { loading, handleSubmit };
};

export const useUpdateSettings = (id: number, onSuccess?: () => void) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (values: any) => {
    if (values) {
      setLoading(true);
      UpdateDeviceSettingRequest(id, {
        ...values,
        sensors: transformSettings(values.sensors)
      })
        .then(() => {
          onSuccess?.();
        })
        .finally(() => setLoading(false));
    }
  };

  return { loading, handleSubmit };
};

export const useUpdateNetwork = (network?: Network) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (values: any) => {
    if (network && values) {
      setLoading(true);
      UpdateNetworkRequest(network.id, { ...values, name: network.name }).finally(() =>
        setLoading(false)
      );
    }
  };

  return { loading, handleSubmit };
};
