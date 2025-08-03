import React from 'react';
import { Radio } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark } from '../../../../components';
import { cursors, useContext } from './context';

export const Switcher = () => {
  const { cursor, setCursor, reset } = useContext();
  const { visibledMarks } = ChartMark.useContext();
  const centeredMark = visibledMarks.find((mark) => mark.name.indexOf('center') > -1);

  return (
    <Radio.Group
      buttonStyle='solid'
      onChange={(e) => {
        setCursor(e.target.value);
        if (e.target.value === 'center') {
          reset();
        }
      }}
      options={cursors.map((c) => {
        return {
          label: intl.get(`sideband.${c}`),
          value: c,
          disabled: c === 'side' && !centeredMark
        };
      })}
      optionType='button'
      style={{ position: 'absolute', right: 16, top: 70 }}
      value={cursor}
    />
  );
};
