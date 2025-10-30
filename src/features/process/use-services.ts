import { useRequest } from 'ahooks';
import request from '../../utils/request';
import { autoFillParameter, ProcessType } from '../../process-type';
import intl from 'react-intl-universal';

type AutoFillParameter = { [Key in keyof typeof autoFillParameter]: number };

export type ProcessDTO = {
  id: number;
  type: number;
  assetId: number;
  sourceId: number;
  parameters: Partial<AutoFillParameter>;
};

export type ProcessFormDataDTO = {
  type: number;
  source_id: number;
  parameters: Partial<AutoFillParameter>;
};

export const transform = (dto: ProcessDTO): ProcessFormDataDTO => {
  return {
    type: dto.type,
    source_id: dto.sourceId,
    parameters: dto.parameters
  };
};

export type Process = ProcessDTO & {
  typeLabel: string;
  sourceIdName: string;
  targetDeviceId?: number;
  deviceName: string;
  fillingCapacity?: number;
};

export const transform2Process = (
  dto: ProcessDTO,
  getSourceIdName: (id: number) => string,
  getDeviceName: (id?: number) => string
): Process => {
  return {
    ...dto,
    typeLabel: intl.get(ProcessType.Key.getLabel(dto.type)),
    sourceIdName: getSourceIdName(dto.sourceId),
    targetDeviceId: dto.parameters.targetDeviceId,
    deviceName: getDeviceName(dto.parameters.targetDeviceId),
    fillingCapacity: dto.parameters.fillingCapacity
  };
};

export const useBindProcess = () => useRequest(bindAction, { manual: true });

const bindAction = async (id: number, data: ProcessFormDataDTO) => {
  request.put(`/assets/${id}/bindAction`, data);
};

export const unbindAction = async (id: number) => {
  request.put(`/assets/${id}/unbindAction`, { id });
};
