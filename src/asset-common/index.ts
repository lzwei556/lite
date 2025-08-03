import { AssetModel, AssetRow } from './types';
import { isWindRelated } from '../features/asset-wind-turbine';
import { isArea, isCorrosionRelated, isDeviceRelated, isVibrationRelated } from '../asset-variant';
import { isMonitoringPoint } from '../monitoring-point';
import { getColorByValue, getLabelByValue } from './assetStatus';
import { resolveDescendant, resolveStatus } from './utils/statistics';

export * from '../views/home/tree';
export * from './components';
export * from '../monitoring-point';
export * from './constants';
export * from './services';
export * from './types';

export const Asset = {
  Assert: {
    isArea,
    isWindRelated,
    isMonitoringPoint,
    isVibrationRelated,
    isCorrosionRelated,
    isDeviceRelated
  },
  convert: (values?: AssetRow): AssetModel | null => {
    if (!values) return null;
    return {
      id: values.id,
      name: values.name,
      parent_id: values.parentId,
      type: values.type,
      attributes: values.attributes
    };
  },
  Statistics: {
    resolveDescendant,
    resolveStatus
  },
  Status: {
    getLabelByValue,
    getColorByValue
  }
};
