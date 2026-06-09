import * as MonitoringPoint from 'domains/monitoring-point';
import { DeviceType } from 'types/device_type';
import { transformSnake2Dot } from 'utils/format';
import { toSnake } from 'ts-case-convert';
import { Enum } from './type-enum';
import * as PrimaryAsset from '../primary';
import { canAddAreaChild } from './area-treenode';

type Config = {
  label: string;
  children: PrimaryAsset.Enum[];
};

const table: { [Key in Enum]: Config } = {
  [Enum.WindTurbine]: {
    label: Enum[Enum.WindTurbine],
    children: [PrimaryAsset.Enum.Flange, PrimaryAsset.Enum.Tower]
  },
  [Enum.Area]: {
    label: Enum[Enum.Area],
    children: PrimaryAsset.Category.vibrations
  }
};

export const getMonitoringPointTypes = (
  folderTypes: Enum[],
  primaryAssetTypes?: PrimaryAsset.Enum[]
): MonitoringPoint.Type.Enum[] => {
  const children = getChildren(folderTypes);
  const filtered = primaryAssetTypes
    ? children.filter((type) => primaryAssetTypes.includes(type))
    : children;
  return PrimaryAsset.getMonitoringPointTypes(filtered);
};
export const Enums = Object.values(Enum).filter((v) => typeof v === 'number') as Enum[];
export { Enum, canAddAreaChild };

export const getlabelPlural = (key: Enum) => `${getLabel(key)}s`;
export const getChildrenOptions = (keys: Enum[]) =>
  getChildren(keys).map((type) => ({ value: type, label: PrimaryAsset.getLabel(type) }));
export const getDeviceTypes = (folderTypes: Enum[], primaryAssetTypes?: PrimaryAsset.Enum[]) => {
  const result = new Set<DeviceType>();
  getMonitoringPointTypes(folderTypes, primaryAssetTypes).forEach((type) =>
    MonitoringPoint.Type.getDeviceTypes(type).forEach((deviceType) => {
      result.add(deviceType);
    })
  );
  return Array.from(result);
};

export const getLabel = (type: Enum) => {
  const PREFIX = 'asset.category.';
  const config = table[type];
  return type ? `${PREFIX}${transformSnake2Dot(toSnake(config.label))}` : `${type}`;
};

export const getTitle = (types: Enum[]): string => {
  let title = 'ASSET';
  if (types.length === 1) {
    title = getLabel(types[0]);
  }
  return title;
};

const getChildren = (types: Enum[]): PrimaryAsset.Enum[] => {
  const result = new Set<PrimaryAsset.Enum>();

  for (const type of types) {
    const children = table[type]?.children ?? [];
    for (const child of children) {
      result.add(child);
    }
  }

  return Array.from(result);
};
