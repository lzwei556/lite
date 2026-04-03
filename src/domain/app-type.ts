import { DeviceType } from 'types/device_type';
import { FolderAssetType, FolderAsset } from './asset/folder';
import { PrimaryAsset, PrimaryAssetType } from './asset/primary';
import { MonitoringPointType, OMonitoringPoint } from './monitoring-point';

type Type =
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
  folderAssetTypes: FolderAssetType[];
  primaryAssetTypes?: PrimaryAsset.Type[];
};
const corrosion: Config = {
  name: 'CORROSION_MONITORING_SYSTEM',
  rootAsset: { label: FolderAsset.Type[FolderAsset.Type.Area], labels: 'areas' },
  folderAssetTypes: [FolderAsset.Type.Area],
  primaryAssetTypes: [PrimaryAssetType.Pipe, PrimaryAssetType.Tank]
};
const general: Config = {
  name: 'IOT_CLOUD_MONITORING_SYSTEM',
  rootAsset: { label: 'ASSET', labels: 'assets' },
  folderAssetTypes: [FolderAsset.Type.Area, FolderAsset.Type.WindTurbine]
};
const vibration: Config = {
  name: 'IOT_CLOUD_MONITORING_SYSTEM',
  rootAsset: { label: FolderAsset.Type[FolderAsset.Type.Area], labels: 'areas' },
  folderAssetTypes: [FolderAsset.Type.Area],
  primaryAssetTypes: PrimaryAssetType.Category.vibrations
};
const windTurbine: Config = {
  name: 'WIND_TURBINE_BOLT_MONITORING_SYSTEM',
  rootAsset: { label: FolderAsset.Type[FolderAsset.Type.WindTurbine], labels: 'wind.turbines' },
  folderAssetTypes: [FolderAsset.Type.WindTurbine],
  primaryAssetTypes: [PrimaryAssetType.Flange]
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
    primaryAssetTypes: [PrimaryAssetType.Flange, PrimaryAssetType.Tower]
  }
};

const get = (type: Type): Config => table[type];

export type AppType = Type;

export const AppTypeConfig = {
  get,
  getMonitoringPointTypeOptions: (type: Type): { value: MonitoringPointType; label: string }[] => {
    const { folderAssetTypes, primaryAssetTypes } = get(type);
    return FolderAsset.getMonitoringPointTypes(folderAssetTypes, primaryAssetTypes).map(
      (value) => ({ value, label: OMonitoringPoint.Type.getLabel(value) })
    );
  },
  getDeviceTypes: (type: Type): DeviceType[] => {
    const { folderAssetTypes, primaryAssetTypes } = get(type);
    return FolderAsset.getDeviceTypes(folderAssetTypes, primaryAssetTypes);
  }
};
