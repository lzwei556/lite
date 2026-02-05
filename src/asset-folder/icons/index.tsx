import React from 'react';
import AntIcon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Asset, AssetRow } from '../../asset-common';
import { useGlobalStyles } from 'styles';
import { AssetCategory } from 'common/asset-category';
import { Flex } from 'components';
import { ReactComponent as WindSvg } from './wind_turbine.svg';
import { ReactComponent as GeneralSvg } from './general.svg';

export const Icon = (props: Partial<CustomIconComponentProps> & { asset: AssetRow }) => {
  const { asset, ...rest } = props;
  const assetStatusColor = Asset.Status.getColorByValue(asset.alertLevel);
  const commonProps = { ...rest, fill: assetStatusColor };
  const { colorBgContainerStyle } = useGlobalStyles();

  if (asset.type === AssetCategory.Value.WindTurbine) {
    return (
      <Flex
        justify='center'
        style={{ ...rest.style, ...rest, borderRadius: '100%', backgroundColor: assetStatusColor }}
      >
        <AntIcon
          component={() => (
            <WindSvg {...commonProps} fill={colorBgContainerStyle.backgroundColor} />
          )}
        />
      </Flex>
    );
  }

  return <AntIcon component={() => <GeneralSvg {...commonProps} />} />;
};
