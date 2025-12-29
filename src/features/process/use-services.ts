import { useRequest } from 'ahooks';
import request from '../../utils/request';
import { autoFillParameter, ProcessType } from '../../process-type';
import intl from 'react-intl-universal';
import { Device } from '../../types/device';
import { PageResult } from 'types/page';
import { pickOptionsFromNumericEnum } from 'utils';

type AutoFillParameter = { [Key in keyof typeof autoFillParameter]: number };

export type ProcessDTO = {
  id: number;
  type: number;
  assetId: number;
  sourceId: number;
  monitoringPointId: number;
  parameters: Partial<AutoFillParameter>;
};

export type ProcessFormDataDTO = {
  type: number;
  source_id: number;
  monitoring_point_id: number;
  parameters: Partial<AutoFillParameter>;
};

export const transform = (dto: ProcessDTO): ProcessFormDataDTO => {
  return {
    type: dto.type,
    source_id: dto.sourceId,
    monitoring_point_id: dto.monitoringPointId,
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

export const unbindAction = async (assetId: number, id: number) => {
  request.put(`/assets/${assetId}/unbindAction`, { id });
};

export const useDevices = () => useRequest(getDevices);

const getDevices = async () => {
  const res = await request.get<Device[]>('/devices', {});
  return res.data.data;
};

export type FillRecord = {
  assetId: number;
  monitoringPointId: number;
  timestamp: number;
  result: Result;
  dataType: DataType;
  deviceId: number;
  dataSourceId: number;
  capacity: number;
  soundPressureLevel: number;
  energyRatio: number;
  stationarity: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  temperature: number;
  diagnosisResults: { items: { diagnosis: DiagnosisResult; confidence: DiagnosisConfidence }[] };
  reasons: Reason[];
};

export enum DataType {
  Characteristic,
  Diagnosis
}

export const dataTypeOptions = pickOptionsFromNumericEnum(DataType, 'fill.record');

enum Result {
  Success = 0x00,
  Offline = 0x01,
  CommandFailure = 0x02
}

export const fillResultOptions = pickOptionsFromNumericEnum(Result, 'fill.result');

enum Reason {
  Temperatue = 0x01,
  soundPressureLevel = 0x02,
  energyRatio = 0x03,
  stationarity = 0x04,
  velocityX = 0x05,
  velocityY = 0x06,
  velocityZ = 0x07,
  Diagnosis = 0x08
}

export const fillReasonOptions = pickOptionsFromNumericEnum(Reason, 'fill.reason');

enum DiagnosisResult {
  Wear = 1001,
  Loose = 1002,
  NonCenter = 1003,
  Mounting = 1004
}

export const diagnosisResultOptions = pickOptionsFromNumericEnum(
  DiagnosisResult,
  'diagnosis.result'
);

enum DiagnosisConfidence {
  Normal = 1,
  Info = 2,
  Warning = 3,
  Danger = 4
}

export const diagnosisConfidenceOptions = pickOptionsFromNumericEnum(
  DiagnosisConfidence,
  'diagnosis.confidence'
);

export const useFillRecords = (params: Parameters<typeof getFillRecords>) =>
  useRequest(getFillRecords, { defaultParams: params, manual: true });

const getFillRecords = async (
  id: number,
  // params: { from: number; to: number; type: DataType; page: number; size: number }
  params: { from: number; to: number; page: number; size: number }
) => {
  const { data } = await request.get<PageResult<FillRecord[]>>(
    `/monitoringPoints/${id}/fillRecords`,
    params
  );
  return data.data;
};
