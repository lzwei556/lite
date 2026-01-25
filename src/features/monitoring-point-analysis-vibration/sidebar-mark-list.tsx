import React from 'react';
import { Sidebar } from './mark/sidebar';
import { AnalysisSidebarCollapse } from 'features/monitoringPoint';
import intl from 'react-intl-universal';
import { MarkList, MarksTabs, MarkType } from './mark';
import { FaultFrequencyMarkList } from './faultFrequencyMarkList';
import { SettingsDetail } from 'asset-variant';
import { AssetRow } from 'asset-common';
import { FaultFrequency } from './useFaultFrequency';

export const SidebarMarkList = ({
  asset,
  markType,
  markTypes,
  faultFrequency
}: {
  asset: AssetRow;
  markType: MarkType;
  markTypes?: MarkType[];
  faultFrequency?: FaultFrequency;
}) => {
  return (
    <Sidebar>
      <AnalysisSidebarCollapse
        defaultActiveKey={['overview', 'marklist']}
        items={[
          {
            key: 'marklist',
            label: intl.get(`analysis.vibration.cursor.${markType.toLowerCase()}`),
            children:
              // <MarksTabs
              //   hiddens={markTypes}
              //   markType={markType}
              //   key={markType}
              //   faultMarkList={<FaultFrequencyMarkList faultFrequency={faultFrequency} />}
              // />
              markType === 'Faultfrequency' ? (
                <FaultFrequencyMarkList faultFrequency={faultFrequency} />
              ) : (
                <MarkList markType={markType} />
              )
          },
          {
            key: 'overview',
            label: intl.get('BASIC_INFORMATION'),
            children: (
              <SettingsDetail
                attributes={asset.attributes}
                type={asset.type}
                groups={['bearing.parameters']}
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
