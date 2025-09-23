import React from 'react';
import { Asset, AssetRow, MonitoringPointRow, useContext } from '../../asset-common';
import * as Area from '../../features/asset-area';
import * as Device from '../../features/asset-device';
import * as Vibration from '../../features/asset-vibration';
import * as Corrosion from '../../features/asset-corrosion';
import * as Wind from '../../features/asset-wind-turbine';
import { MonitoringPoint } from '../monitoring-point';

export default function Main() {
  const contextProps = useContext();
  const { selectedNode } = contextProps;

  if (selectedNode) {
    const { type } = selectedNode;
    if (Asset.Assert.isArea(type)) {
      return <Area.Main {...contextProps} />;
    } else if (Asset.Assert.isDeviceRelated(type)) {
      return <Device.Index {...{ ...contextProps, asset: selectedNode as AssetRow }} />;
    } else if (Asset.Assert.isVibrationRelated(type)) {
      return <Vibration.Index {...{ ...contextProps, asset: selectedNode as AssetRow }} />;
    } else if (Asset.Assert.isCorrosionRelated(type)) {
      return <Corrosion.Index {...{ ...contextProps, asset: selectedNode as AssetRow }} />;
    } else if (Asset.Assert.isWindRelated(type)) {
      return <Wind.Main {...contextProps} />;
    } else {
      return (
        <MonitoringPoint
          monitoringPoint={selectedNode as MonitoringPointRow}
          onSuccess={contextProps.refresh}
        />
      );
    }
  } else {
    return null;
  }
}
