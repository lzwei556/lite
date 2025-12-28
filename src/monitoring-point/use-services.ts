import { useRequest } from 'ahooks';
import { MonitoringPoint, MonitoringPointPostDTO, MonitoringPointType } from 'common';
import React from 'react';
import request from 'utils/request';

type SensorBindingInput = Pick<MonitoringPointPostDTO, 'channel' | 'device_id'> & {
  process_id: number;
};
type SensorBindingOutput = Omit<SensorBindingInput, 'channel'> & {
  parameters?: Pick<SensorBindingInput, 'channel'>;
};

export const useUpdateMonitoringPoint = ({ id, device }: MonitoringPoint) => {
  const unBindSensorRq = useUnBindSensor();
  const bindSensorRq = useBindSensor();
  const updateRq = useRequest(updateMonitoringPoint, { manual: true });
  const [error, setError] = React.useState<string>();

  const handleSubmit = async (data: MonitoringPointPostDTO) => {
    const oldSensorId = device?.id;
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

const getProcessId = (data: MonitoringPointPostDTO) => {
  const processId = MonitoringPointType.Key.getProcessId(data.type);
  return processId ? processId : data.channel ? 2 : 1;
};

const updateMonitoringPoint = async (id: number, data: MonitoringPointPostDTO) => {
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
