import React from 'react';
import _ from 'lodash';
import * as Axis from '../axis';
import * as VD from '../vibration-direction';
import { VibrationDirection, AxisWithVibrationDirection } from './settings';

export const useAxisWithVibrationDirection = (attrs?: VibrationDirection) => {
  const options: AxisWithVibrationDirection[] = _.orderBy(
    Axis.Options.map((opt) => {
      const direction = getVibrationDirectionByAxisKey(opt.key, attrs);
      return { ...opt, direction };
    }),
    (option) => option.direction?.sort ?? option.value,
    'desc'
  ).map(({ direction, ...rest }) => ({
    ...rest,
    label: direction ? direction.abbr : rest.label
  }));
  const [axis, setAxis] = React.useState(options[0]);
  return { axis, setAxis, options };
};

const getVibrationDirectionByAxisKey = (
  axisKey: Axis.Key,
  attrs?: VibrationDirection
): VD.Option | undefined => {
  let key: VD.Key;
  if (attrs) {
    for (key in attrs) {
      const _axisKey = attrs[key];
      if (_axisKey === axisKey) {
        return VD.get(key);
      }
    }
  }
};
