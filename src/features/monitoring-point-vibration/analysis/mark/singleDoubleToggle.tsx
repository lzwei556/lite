import React from 'react';
import Icon from '@ant-design/icons';
import intl from 'react-intl-universal';
import { MarkType, useMarkContext } from './context';
import { ReactComponent as MouseSVG } from './mouse.svg';
import { IconButton } from '../../../../components';

type ToggleMarkType = Extract<MarkType, 'Peak' | 'Double'>;

export const SingleDoubleToggle = () => {
  const { setMarkType } = useMarkContext();
  const [type, setType] = React.useState<ToggleMarkType>('Peak');

  return (
    <IconButton
      color='primary'
      onClick={() => {
        const _type = type === 'Peak' ? 'Double' : 'Peak';
        setType(_type);
        setMarkType(_type);
      }}
      icon={
        <Icon
          component={() => <MouseSVG {...{ width: '1em', height: '1em', fill: 'currentcolor' }} />}
        />
      }
      size='small'
      tooltipProps={{ title: intl.get(`analysis.vibration.cursor.double`) }}
      variant={type === 'Double' ? 'solid' : 'outlined'}
    />
  );
};
