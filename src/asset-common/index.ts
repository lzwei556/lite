import { AssetModel, AssetRow } from './types';
import { isMonitoringPoint } from '../monitoring-point';
import { getColorByValue, getLabelByValue } from './assetStatus';
import { resolveDescendant, resolveStatus } from './utils/statistics';

export * from './components';
export * from '../monitoring-point';
export * from './services';
export * from './types';

export const Asset = {
  Assert: {
    isMonitoringPoint
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
