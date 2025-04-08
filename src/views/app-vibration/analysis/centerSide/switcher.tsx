import React from 'react';
import { Radio } from 'antd';
import { ChartMark } from '../../../../components';
import { useContext } from './context';

export const Switcher = () => {
  const { cursor, setCursor, cursorOptions } = useContext();
  const { dispatchMarks } = ChartMark.useContext();
  return (
    <Radio.Group
      buttonStyle='solid'
      onChange={(e) => {
        setCursor(e.target.value);
        if (e.target.value === 'center') {
          dispatchMarks({ type: 'clear' });
        }
      }}
      options={cursorOptions}
      optionType='button'
      style={{ position: 'absolute', right: 16, top: 70 }}
      value={cursor}
    />
  );
};
