import React from 'react';
import { Sidebar } from './mark/sidebar';
import { AnalysisSidebarCollapse } from 'features/monitoringPoint';
import { Translation } from 'locales/utils';
import { MarkList, MarkType } from './mark';
import { SettingsDetail } from 'asset-variant';
import { AssetRow } from 'asset-common';

export const SidebarMarkList = ({ asset, markType }: { asset: AssetRow; markType: MarkType }) => {
  return (
    <Sidebar>
      <AnalysisSidebarCollapse
        defaultActiveKey={['overview', 'marklist']}
        items={[
          {
            key: 'marklist',
            label: Translation.get(`vibration.analysis.cursor.${markType.toLowerCase()}`),
            children: <MarkList markType={markType} />
          },
          {
            key: 'overview',
            label: Translation.get('common.basic'),
            children: (
              <SettingsDetail
                attributes={asset.attributes}
                type={asset.type}
                groups={['diagnosis.bearing.parameters']}
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
