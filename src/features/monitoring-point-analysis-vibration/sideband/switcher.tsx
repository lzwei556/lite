import React from 'react';
import { Translation } from 'locales/utils';
import { ChartMark, RadioFormItem } from 'components';
import { cursors, useContext } from './context';

export const Switcher = () => {
  const { cursor, setCursor, reset } = useContext();
  const { marks } = ChartMark.useContext();
  const centeredMark = marks.find((mark) => mark.name.indexOf('center') > -1);

  return (
    <RadioFormItem
      noStyle
      radioGroupProps={{
        onChange: (e) => {
          setCursor(e.target.value);
          if (e.target.value === 'center') {
            reset();
          }
        },
        options: cursors.map((c) => {
          return {
            label: Translation.get(`vibration.analysis.sideband.${c}`),
            value: c,
            disabled: c === 'side' && !centeredMark
          };
        }),
        style: { position: 'absolute', right: 16, top: 70 },
        value: cursor
      }}
    />
  );
};
