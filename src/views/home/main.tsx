import React from 'react';
import { AssetRow, MonitoringPointRow, useContext } from '../../asset-common';
import { Index as AssetFolder } from 'asset-folder';
import { Index as AssetPrimary } from 'asset-primary';
import { Index2 } from 'monitoring-point/index2';
import { AssetCategory } from 'common/asset-category';

export default function Main() {
  const contextProps = useContext();
  const { selectedNode } = contextProps;

  if (selectedNode) {
    const { type } = selectedNode;
    if (AssetCategory.Categories.getKeys(['folder']).includes(type)) {
      return <AssetFolder asset={selectedNode as AssetRow} />;
    }
    // else if()  === Asset.WindTurbine
    // else if()  === Asset.primary
    else if (type < 10000) {
      return <AssetPrimary asset={selectedNode as AssetRow} />;
    } else {
      return (
        <Index2
          monitoringPoint={selectedNode as MonitoringPointRow}
          onSuccess={contextProps.refresh}
        />
      );
    }
  } else {
    return null;
  }
}
