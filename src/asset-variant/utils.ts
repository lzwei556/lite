import { mapTree } from '../utils/tree';
import { AssetRow, useContext } from '../asset-common';
import { area, device, pipe, tank } from './constants';
import { AssetCategory } from '../asset-category';

export function isArea(type: number) {
  return type === area.type;
}

export function isAssetAreaParent(asset: AssetRow) {
  return asset.type === area.type && isAreaTop(asset) && !hasNonAreaChildren(asset);
}

function hasNonAreaChildren(asset: AssetRow) {
  return asset.children ? asset.children.some((c) => c.type !== area.type) : false;
}

function isAreaTop(asset: AssetRow) {
  return asset.parentId === 0;
}

export function isAssetValidParent(asset: AssetRow) {
  return asset.type === area.type && !hasAreaChildren(asset);
}

function hasAreaChildren(asset: AssetRow) {
  return asset.children ? asset.children.some((c) => c.type === area.type) : false;
}

export function useParents() {
  const { assets } = useContext();
  const parents: AssetRow[] = [];
  assets
    .filter((a) => a.type === area.type)
    .forEach((a) => {
      if (isAssetValidParent(a)) {
        parents.push(a);
      }
      if (a.children && a.children.length > 0) {
        parents.push(...a.children.filter(isAssetValidParent));
      }
    });
  return parents;
}

export function useMonitoringPointParents(
  isAssetValidParentFn2: (asset: AssetRow) => boolean,
  parent?: AssetRow
) {
  const { assets } = useContext();
  if (parent && isAssetValidParentFn2(parent)) {
    return [];
  } else {
    const parents: AssetRow[] = [];
    mapTree(
      assets.filter((a) => a.type === area.type),
      (asset) => {
        if (isAssetValidParentFn2(asset)) {
          parents.push(asset);
        }
      }
    );
    return parents;
  }
}

export function isVibrationRelated(type: number) {
  return AssetCategory.vibrationAssetOptions.map((opt) => opt.type).includes(type);
}

export function isCorrosionRelated(type: number) {
  return type === pipe.type || type === tank.type;
}

export function isDeviceRelated(type: number) {
  return type === device.type;
}
