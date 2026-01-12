import { Col } from 'antd';
import { AssetNavigator, AssetRow } from 'asset-common';
import { Grid, TabsDetail } from 'components';
import React from 'react';
import intl from 'react-intl-universal';
import { FolderAssetUpdateFormCard, useUpdateFormProps } from 'features/asset-settings';
import { AssetCategory } from 'common/asset-category';
import { AssetsArea } from './area/assets';
import { AssetsWindTurbine } from './wind-turbine/assets';
import { PrimaryAssetSettingsTable } from 'features/asset-list';

export const Index = ({ asset }: { asset: AssetRow }) => {
  const updateFormProps = useUpdateFormProps(asset);
  return (
    <TabsDetail
      items={[
        {
          label: intl.get('assets'),
          key: 'asset',
          content:
            AssetCategory.Value.Area === asset.type ? (
              <AssetsArea asset={asset} key={asset.id} />
            ) : (
              <AssetsWindTurbine asset={asset} key={asset.id} />
            )
        },
        {
          label: intl.get('SETTINGS'),
          key: 'settings',
          content: (
            <Grid>
              <Col span={24}>
                <FolderAssetUpdateFormCard {...updateFormProps} />
              </Col>
              <Col span={24}>
                <PrimaryAssetSettingsTable />
              </Col>
            </Grid>
          )
        }
      ]}
      title={<AssetNavigator asset={asset} />}
    />
  );
};
