import React from 'react';
import { PictureOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { saveAsImage } from '../../utils/image';
import { useGlobalStyles } from '../../styles';
import { IconButton } from '../icon-button';
import { ChartHandler } from './chart';

export const SaveImageIconButton = (props: { chartHandler: ChartHandler; filename?: string }) => {
  const { chartHandler, filename } = props;
  const { colorBgContainerStyle } = useGlobalStyles();

  return (
    <IconButton
      color='primary'
      icon={<PictureOutlined />}
      onClick={() => {
        const url = chartHandler.getInstance()?.getDataURL(colorBgContainerStyle);
        if (url) {
          saveAsImage(url, `${filename ?? new Date().getTime()}.png`);
        }
      }}
      size='small'
      tooltipProps={{ title: intl.get('analysis.save.as.image') }}
      variant='outlined'
    />
  );
};
