import { useRequest } from 'ahooks';
import React from 'react';
import request from 'utils/request';
import { UpdateFormProps } from './update-form';
import { useNotificationContext } from 'providers/notification';
import intl from 'react-intl-universal';
import { CreateFormProps } from './create-form-modal';
import * as MonitoringPoint from 'domains/monitoring-point';
import { Component, PrimaryAsset } from 'domains/asset';

export const useComponents = (type: number) => {
  const assetCategories = PrimaryAsset.getTypesByMonitoringPointTypes([type]);
  const componentIds: number[] = [];
  assetCategories.forEach((type) => {
    componentIds.push(...PrimaryAsset.getComponentIds(type));
  });
  return [{ key: 0, label: 'NONE' }].concat(
    Array.from(new Set(componentIds)).map((id) => Component.get(id))
  );
};

type SensorBindingInput = Pick<MonitoringPoint.Types.PostDTO, 'channel' | 'device_id'> & {
  process_id: number;
};
type SensorBindingOutput = Omit<SensorBindingInput, 'channel'> & {
  parameters?: Pick<SensorBindingInput, 'channel'>;
};

export const useCreateFormProps = (success: () => void): CreateFormProps => {
  const { loading, runAsync } = useAddMonitoringPoints();

  const { messageInstance } = useNotificationContext();
  const handleSubmit = async (values: Parameters<typeof addMonitoringPoints>[0]) => {
    try {
      const data = await runAsync(values);
      if (data.code === 200) {
        messageInstance.success(intl.get('CREATED_SUCCESSFUL'));
        success();
      } else {
        messageInstance.error(intl.get(data.msg).d(data.msg));
      }
    } catch (error) {
      console.log(error);
      messageInstance.error(intl.get('server.error'));
    }
  };
  return { loading, handleSubmit };
};

const useAddMonitoringPoints = () => useRequest(addMonitoringPoints, { manual: true });

const addMonitoringPoints = async (params: MonitoringPoint.Types.PostDTO[]) => {
  const { data } = await request.post(`monitoringPoints/batch`, {
    monitoring_points: params.map((m) => ({
      ...m,
      device_binding: { device_id: m.device_id, process_id: getProcessId(m) }
    }))
  });
  return data;
};

export const useUpdateFormProps = (
  monitoringPoint: MonitoringPoint.Types.Entity
): UpdateFormProps => {
  const { error, handleSubmit, loading } = useUpdateMonitoringPoint(monitoringPoint);
  const { messageInstance } = useNotificationContext();
  return {
    loading,
    monitoringPoint,
    handleSubmit: (values) => {
      handleSubmit(values);
      if (error) {
        messageInstance.error(`${intl.get('FAILED_TO_UPDATE')} ${intl.get(error).d(error)}`);
      } else {
        messageInstance.success(intl.get('UPDATED_SUCCESSFUL'));
      }
    }
  };
};

const useUpdateMonitoringPoint = ({ id, sensor }: MonitoringPoint.Types.Entity) => {
  const unBindSensorRq = useUnBindSensor();
  const bindSensorRq = useBindSensor();
  const updateRq = useRequest(updateMonitoringPoint, { manual: true });
  const [error, setError] = React.useState<string>();

  const handleSubmit = async (data: MonitoringPoint.Types.PostDTO) => {
    const oldSensorId = sensor?.id;
    const bindingInput = { ...data, process_id: getProcessId(data) };
    let canDoNext = false;
    let error;
    const isBindSuccess = bindSensorRq.data?.code === 200;
    const isUnBindSuccess = unBindSensorRq.data?.code === 200;
    try {
      if (!oldSensorId) {
        await bindSensorRq.runAsync(id, bindingInput);
        canDoNext = isBindSuccess;
      } else if (oldSensorId !== data.device_id) {
        await unBindSensorRq.runAsync(id, oldSensorId);
        if (isUnBindSuccess) {
          await bindSensorRq.runAsync(id, bindingInput);
          canDoNext = isBindSuccess;
        }
      } else {
        canDoNext = true;
      }
      if (canDoNext) {
        await updateRq.runAsync(id, data);
        if (updateRq.data?.code !== 200) {
          error = updateRq.data?.msg;
        }
      } else {
        error = bindSensorRq.data?.msg || unBindSensorRq.data?.msg;
      }
    } catch (ex) {
      console.log(ex);
      setError('server.error');
    } finally {
      setError(error);
    }
  };
  return {
    error,
    handleSubmit,
    loading: unBindSensorRq.loading || bindSensorRq.loading || updateRq.loading
  };
};

const getProcessId = (data: MonitoringPoint.Types.PostDTO) => {
  const processId = MonitoringPoint.Type.getProcessId(data.type);
  return processId ? processId : data.channel ? 2 : 1;
};

const updateMonitoringPoint = async (id: number, data: MonitoringPoint.Types.PostDTO) => {
  const res = await request.put(`/monitoringPoints/${id}`, data);
  return res.data;
};

const useBindSensor = () => useRequest(bindSensor, { manual: true });

const bindSensor = async (id: number, input: SensorBindingInput) => {
  const { data } = await request.post(
    `/monitoringPoints/${id}/bindDevice`,
    transform2BindingOutput(input)
  );
  return data;
};

const transform2BindingOutput = (input: SensorBindingInput): SensorBindingOutput => {
  return input.channel ? { ...input, parameters: { channel: input.channel } } : input;
};

const useUnBindSensor = () => useRequest(unbindSensor, { manual: true });

const unbindSensor = async (id: number, device_id: number) => {
  const { data } = await request.post(`/monitoringPoints/${id}/unbindDevice`, { device_id });
  return data;
};
