import { toSnake } from 'ts-case-convert';
import { ProcessTypeKey, processTypes } from './constants';
import { transformSnake2Dot } from '../utils';
import { AssetRow } from 'asset-common';
import { foreachTree } from 'utils/tree';
import { useAssetsContext } from 'providers/assets';

export const getOptions = () =>
  processTypes.map(({ key }) => ({ value: key, label: Key.getLabel(key) }));

const PREFIX = 'process.type.';

export const Key = {
  getLabel: (key: ProcessTypeKey) => {
    const type = get(key);
    return type ? `${PREFIX}${transformSnake2Dot(toSnake(type.label))}` : `${key}`;
  },
  getSourceType: (key: ProcessTypeKey) => {
    return get(key)?.sourceType;
  },
  getDeviceType: (key: ProcessTypeKey) => {
    return get(key)?.deviceType;
  },
  getParameters: (key: ProcessTypeKey) => {
    return get(key)?.parameters ?? [];
  }
};

const get = (key: ProcessTypeKey) => {
  return processTypes.find((type) => type.key === key) || null;
};

export const useDataSources = (assetId: number, key: ProcessTypeKey) => {
  const { assets } = useAssetsContext();
  let asset: AssetRow | undefined;
  foreachTree(assets, (node) => {
    if (node.id === assetId) {
      asset = node;
    }
  });
  return asset ? (asset.monitoringPoints ?? []).filter((m) => m.type === get(key)?.sourceType) : [];
};
