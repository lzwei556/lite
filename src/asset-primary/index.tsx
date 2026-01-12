import { AssetNavigator, AssetRow } from 'asset-common';
import { TabsDetail, TabsDetailsItems } from 'components';
import { PropertyTable } from 'features/monitoring-points/property-table';
import React from 'react';
import intl from 'react-intl-universal';
import { Settings } from './settings';
import { Overview } from './overview';
import { AssetModelProvider } from 'asset-model/context';
import { AssetCategory, isFlangePreloadCalculationEnabled } from 'common/asset-category';
import { ENV } from 'utils/env';
import { OverviewLegacy } from './overview-legacy';
import { CustomizableIntervals } from 'features/feature-data';
import { FlangeOverview } from './overview-flange';
import { FlangeStatus } from 'features/feature-data';
import { FlangeOverviewLegacy } from './overview-flange-legacy';

export const Index = ({ asset }: { asset: AssetRow }) => {
  return (
    <AssetModelProvider asset={asset}>
      <TabsDetail items={useFeatures(asset)} title={<AssetNavigator asset={asset} />} />
    </AssetModelProvider>
  );
};

const useFeatures = (asset: AssetRow) => {
  const history = useHistory(asset);
  const flangeStatus = useFlangeStatus(asset);
  const items: TabsDetailsItems = useOverview(asset)
    .concat([
      {
        key: 'monitoring.points',
        label: intl.get('monitoring.points'),
        content: <PropertyTable asset={asset} enableSettingColumnsCount={true} key={asset.id} />
      }
    ])
    .concat(history)
    .concat(flangeStatus)
    .concat([
      {
        key: 'settings',
        label: intl.get('SETTINGS'),
        content: <Settings asset={asset} key={asset.id} />
      }
    ]);
  return items;
};

const useOverview = (asset: AssetRow) => {
  const isLegacy = ENV.legacyEnabled === 'true';
  let overview = null;
  if (AssetCategory.Categories.getKeys(['vibration']).includes(asset.type)) {
    overview = {
      key: 'overview',
      label: intl.get('OVERVIEW'),
      content: isLegacy ? (
        <OverviewLegacy asset={asset} key={asset.id} />
      ) : (
        <Overview asset={asset} key={asset.id} />
      )
    };
  } else if (AssetCategory.Categories.getKeys(['corrosion']).includes(asset.type)) {
    overview = isLegacy
      ? null
      : {
          key: 'overview',
          label: intl.get('OVERVIEW'),
          content: <Overview asset={asset} key={asset.id} />
        };
  } else if (AssetCategory.Value.Flange === asset.type) {
    overview = {
      key: 'overview',
      label: intl.get('OVERVIEW'),
      content: isLegacy ? (
        <FlangeOverviewLegacy asset={asset} key={asset.id} />
      ) : (
        <FlangeOverview asset={asset} key={asset.id} />
      )
    };
  }
  return overview ? [overview] : [];
};

const useHistory = (asset: AssetRow) => {
  if (AssetCategory.Categories.getKeys(['bolt']).includes(asset.type)) {
    return [
      {
        key: 'history',
        label: intl.get('HISTORY_DATA'),
        content: (
          <CustomizableIntervals monitoringPoints={asset.monitoringPoints ?? []} key={asset.id} />
        )
      }
    ];
  } else {
    return [];
  }
};

const useFlangeStatus = (asset: AssetRow) => {
  if (AssetCategory.Value.Flange === asset.type && isFlangePreloadCalculationEnabled(asset)) {
    return [
      {
        key: 'flange-status',
        label: intl.get('FLANGE_STATUS'),
        content: <FlangeStatus {...asset} key={asset.id} />
      }
    ];
  } else {
    return [];
  }
};
