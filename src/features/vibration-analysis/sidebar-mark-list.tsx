import React from 'react';
import { Sidebar } from './mark/sidebar';
import intl from 'react-intl-universal';
import { MarkList, MarkType } from './mark';
import { AssetRow } from 'asset-common';
import { PrimaryAssetSettingsDetail } from 'features/asset-settings';
import { AnalysisSidebarCollapse } from 'components';
import { PrimaryAsset } from 'domain/asset';

export const SidebarMarkList = ({ asset, markType }: { asset: AssetRow; markType: MarkType }) => {
  return (
    <Sidebar>
      <AnalysisSidebarCollapse
        defaultActiveKey={['overview', 'marklist']}
        items={[
          {
            key: 'marklist',
            label: intl.get(`analysis.vibration.cursor.${markType.toLowerCase()}`),
            children: <MarkList markType={markType} />
          },
          {
            key: 'overview',
            label: intl.get('BASIC_INFORMATION'),
            children: (
              <PrimaryAssetSettingsDetail
                attributes={asset.attributes}
                type={asset.type}
                groups={[
                  PrimaryAsset.SettingsGroup.Motor,
                  PrimaryAsset.SettingsGroup.Bearing
                ]}
                maxHeight={400}
                labelStyle={{ minWidth: '5em' }}
                contentStyle={{ justifyContent: 'flex-start' }}
              />
            )
          }
        ]}
      />
    </Sidebar>
  );
};
