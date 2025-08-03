import React from 'react';
import AntIcon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Asset, AssetRow } from '../../asset-common';
import { wind, flange, tower } from './constants';
import { ReactComponent as WindSVG } from './wind_turbine.svg';
import * as Flange from './flange';
import * as Tower from './tower';
import { Flex } from '../../components';

export const Icon = (props: Partial<CustomIconComponentProps> & { asset: AssetRow }) => {
  const { asset, ...rest } = props;
  const assetStatusColor = Asset.Status.getColorByValue(asset.alertLevel);
  const commonProps = { ...rest, fill: assetStatusColor };
  if (asset.type === wind.type) {
    return (
      <Flex
        justify='center'
        style={{ ...rest.style, ...rest, borderRadius: '100%', backgroundColor: assetStatusColor }}
      >
        <AntIcon
          component={() => (
            <WindSVG
              fill='#fff'
              height={rest.height ? (rest.height as number) * 0.85 : undefined}
              width={rest.width ? (rest.width as number) * 0.85 : undefined}
            />
          )}
        />
      </Flex>
    );
  } else if (asset.type === flange.type) {
    return <Flange.Icon {...commonProps} />;
  } else if (asset.type === tower.type) {
    return <Tower.Icon {...commonProps} />;
  } else {
    return null;
  }
};
