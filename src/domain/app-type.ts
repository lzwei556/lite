import { DeviceType } from 'types/device_type';
import * as FolderAsset from './asset/folder';
import * as PrimaryAsset from './asset/primary';
import * as MonitoringPoint from './monitoring-point';

export type Type =
  | 'bolt'
  | 'bridgeBolt'
  | 'corrosion'
  | 'corrosionWirelessHART'
  | 'general'
  | 'hydroTurbine'
  | 'pressure'
  | 'railBolt'
  | 'temperature'
  | 'towerBolt'
  | 'vibration'
  | 'windTurbine'
  | 'windTurbinePro';

type Config = {
  name: string;
  rootAsset: { label: string; labels: string };
  folderAssetTypes: FolderAsset.Enum[];
  primaryAssetTypes?: PrimaryAsset.Enum[];
};
const corrosion: Config = {
  name: 'CORROSION_MONITORING_SYSTEM',
  rootAsset: { label: FolderAsset.Enum[FolderAsset.Enum.Area], labels: 'areas' },
  folderAssetTypes: [FolderAsset.Enum.Area],
  primaryAssetTypes: [PrimaryAsset.Enum.Pipe, PrimaryAsset.Enum.Tank]
};
const general: Config = {
  name: 'IOT_CLOUD_MONITORING_SYSTEM',
  rootAsset: { label: 'ASSET', labels: 'assets' },
  folderAssetTypes: [FolderAsset.Enum.Area, FolderAsset.Enum.WindTurbine]
};
const vibration: Config = {
  name: 'IOT_CLOUD_MONITORING_SYSTEM',
  rootAsset: { label: FolderAsset.Enum[FolderAsset.Enum.Area], labels: 'areas' },
  folderAssetTypes: [FolderAsset.Enum.Area],
  primaryAssetTypes: PrimaryAsset.Category.vibrations
};
const windTurbine: Config = {
  name: 'WIND_TURBINE_BOLT_MONITORING_SYSTEM',
  rootAsset: { label: FolderAsset.Enum[FolderAsset.Enum.WindTurbine], labels: 'wind.turbines' },
  folderAssetTypes: [FolderAsset.Enum.WindTurbine],
  primaryAssetTypes: [PrimaryAsset.Enum.Flange]
};

const table: { [Key in Type]: Config } = {
  bolt: general,
  bridgeBolt: general,
  corrosion,
  corrosionWirelessHART: corrosion,
  general,
  hydroTurbine: { ...windTurbine, name: 'HYDRO_TURBINE_BOLT_MONITORING_SYSTEM' },
  pressure: general,
  railBolt: general,
  temperature: general,
  towerBolt: general,
  vibration,
  windTurbine,
  windTurbinePro: {
    ...windTurbine,
    primaryAssetTypes: [PrimaryAsset.Enum.Flange, PrimaryAsset.Enum.Tower]
  }
};

export const get = (type: Type): Config => table[type];

export const getMonitoringPointTypeOptions = (
  type: Type
): { value: MonitoringPoint.Type.Enum; label: string }[] => {
  const { folderAssetTypes, primaryAssetTypes } = get(type);
  return FolderAsset.getMonitoringPointTypes(folderAssetTypes, primaryAssetTypes).map((value) => ({
    value,
    label: MonitoringPoint.Type.getLabel(value)
  }));
};
export const getDeviceTypes = (type: Type): DeviceType[] => {
  const { folderAssetTypes, primaryAssetTypes } = get(type);
  return FolderAsset.getDeviceTypes(folderAssetTypes, primaryAssetTypes);
};
