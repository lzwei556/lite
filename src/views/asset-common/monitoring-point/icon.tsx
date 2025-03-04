import React from 'react';
import AntIcon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Asset } from '..';
import { ReactComponent as SVG } from './monitoring_point.svg';
import { MonitoringPointRow } from './types';

export const Icon = (
  props: Partial<CustomIconComponentProps> & { monitoringPoint: MonitoringPointRow }
) => {
  const { monitoringPoint, ...rest } = props;
  return (
    <AntIcon
      component={() => (
        <SVG
          {...{ ...rest, fill: Asset.Status.getColorByValue(monitoringPoint.alertLevel || 0) }}
        />
      )}
    />
  );
};
