import { MonitoringPointType, OMonitoringPoint } from 'domain/monitoring-point';
import { DeviceType } from 'types/device_type';
import { transformSnake2Dot } from 'utils/format';
import { toSnake } from 'ts-case-convert';
import { Type } from './type-enum';
import { PrimaryAsset, PrimaryAssetType } from '../primary';
import { canAddAreaChild } from './area-treenode';

type Config = {
  label: string;
  children: PrimaryAsset.Type[];
};

const table: { [Key in Type]: Config } = {
  [Type.WindTurbine]: {
    label: Type[Type.WindTurbine],
    children: [PrimaryAssetType.Flange, PrimaryAssetType.Tower]
  },
  [Type.Area]: {
    label: Type[Type.Area],
    children: PrimaryAssetType.Category.vibrations
  }
};

const getMonitoringPointTypes = (
  folderTypes: Type[],
  primaryAssetTypes?: PrimaryAsset.Type[]
): MonitoringPointType[] => {
  const children = getChildren(folderTypes);
  const filtered = primaryAssetTypes
    ? children.filter((type) => primaryAssetTypes.includes(type))
    : children;
  return PrimaryAssetType.getMonitoringPointTypes(filtered);
};

export type FolderAssetType = Type;

export const FolderAsset = {
  Type,
  get types() {
    return Object.values(Type).filter((v): v is Type => typeof v === 'number');
  },
  getlabelPlural: (key: Type) => `${getLabel(key)}s`,
  getChildrenOptions: (keys: Type[]) =>
    getChildren(keys).map((type) => ({ value: type, label: PrimaryAssetType.getLabel(type) })),
  getMonitoringPointTypes,
  getDeviceTypes: (folderTypes: Type[], primaryAssetTypes?: PrimaryAsset.Type[]) => {
    const result = new Set<DeviceType>();
    getMonitoringPointTypes(folderTypes, primaryAssetTypes).forEach((type) =>
      OMonitoringPoint.Type.getDeviceTypes(type).forEach((deviceType) => {
        result.add(deviceType);
      })
    );
    return Array.from(result);
  },
  Area: {
    canAddAreaChild
  }
};

const getLabel = (type: Type) => {
  const PREFIX = 'asset.category.';
  const config = table[type];
  return type ? `${PREFIX}${transformSnake2Dot(toSnake(config.label))}` : `${type}`;
};

const getChildren = (types: Type[]): PrimaryAsset.Type[] => {
  const result = new Set<PrimaryAsset.Type>();

  for (const type of types) {
    const children = table[type]?.children ?? [];
    for (const child of children) {
      result.add(child);
    }
  }

  return Array.from(result);
};
