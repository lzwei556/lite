import { AssetRow } from 'asset-common';
import { Enum } from './type-enum';
import * as PrimaryAsset from '../primary';

const getChildrenKind = (node: AssetRow) => {
  if (!node.children || node.children.length === 0) return null;
  return node.children[0].type;
};

export const canAddAreaChild = (node: AssetRow, depth: number): boolean => {
  // Rule 1: max depth
  if (depth >= 2) return false;

  const kind = getChildrenKind(node);

  // Rule 2: children can’t be mixed
  return kind === null || kind === Enum.Area;
};

export const canAddAssetChild = (node: AssetRow): boolean => {
  const kind = getChildrenKind(node);

  // Assets are allowed at depth 1 or 2
  // but only if no area children exist
  return (
    kind === null ||
    PrimaryAsset.Category.getTypes(['bolt', 'corrosion', 'device', 'vibration']).includes(kind)
  );
};

export const getValidAreaParents = (root: AssetRow): AssetRow[] => {
  const result: AssetRow[] = [];

  function dfs(node: AssetRow, depth: number) {
    if (canAddAreaChild(node, depth)) {
      result.push(node);
    }

    if (!node.children) return;

    for (const child of node.children) {
      if (child.type === Enum.Area) {
        dfs(child, depth + 1);
      }
    }
  }

  dfs(root, 1);
  return result;
};
