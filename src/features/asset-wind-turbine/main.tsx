import React from 'react';
import { Spin } from 'antd';
import { AssetRow, ContextProps, MonitoringPointRow } from '../../asset-common';
import * as Wind from './detail/index';
import * as Flange from './flange';
import * as Tower from './tower';
import * as Point from '../monitoring-point-wind-turbine';
import { wind, flange, tower } from './constants';

export const Main = ({ loading, selectedNode, refresh }: ContextProps) => {
  const [open, setOpen] = React.useState(false);
  const [updatedAsset, setUpdatedAsset] = React.useState<AssetRow | undefined>();
  const [mointoringPoint, setMonitoringPoint] = React.useState<MonitoringPointRow | undefined>();
  const props = {
    asset: selectedNode as AssetRow,
    onSuccess: refresh,
    onUpdateAsset: (a: AssetRow) => {
      setOpen(true);
      setUpdatedAsset(a);
      setMonitoringPoint(undefined);
    },
    onUpdate: (m: MonitoringPointRow) => {
      setOpen(true);
      setMonitoringPoint(m);
      setUpdatedAsset(undefined);
    }
  };
  let ele = null;
  if (selectedNode) {
    if (selectedNode.type === wind.type) {
      ele = <Wind.Index {...props} />;
    } else if (selectedNode.type === flange.type) {
      ele = <Flange.Index {...props} />;
    } else if (selectedNode.type === tower.type) {
      ele = <Tower.Index {...props} />;
    } else {
      ele = (
        <Point.Index
          {...{ monitoringPoint: selectedNode as MonitoringPointRow, onSuccess: refresh }}
        />
      );
    }
  }
  return (
    <Spin spinning={loading}>
      {ele}
      {updatedAsset && updatedAsset.type === flange.type && (
        <Flange.UpdateModal
          key={updatedAsset.id}
          asset={updatedAsset}
          open={open}
          onCancel={() => {
            setOpen(false);
            setUpdatedAsset(undefined);
          }}
          onSuccess={() => {
            refresh();
            setOpen(false);
            setUpdatedAsset(undefined);
          }}
        />
      )}
      {updatedAsset && updatedAsset.type === tower.type && (
        <Tower.UpdateModal
          key={updatedAsset.id}
          asset={updatedAsset}
          open={open}
          onCancel={() => {
            setOpen(false);
            setUpdatedAsset(undefined);
          }}
          onSuccess={() => {
            refresh();
            setOpen(false);
            setUpdatedAsset(undefined);
          }}
        />
      )}
      {mointoringPoint && (
        <Point.UpdateModal
          key={mointoringPoint.id}
          monitoringPoint={mointoringPoint}
          open={open}
          onCancel={() => {
            setOpen(false);
            setMonitoringPoint(undefined);
          }}
          onSuccess={() => {
            refresh();
            setOpen(false);
            setMonitoringPoint(undefined);
          }}
        />
      )}
    </Spin>
  );
};
