import React from 'react';
import { PictureOutlined } from '@ant-design/icons';
import { saveAsImage } from '../../utils/image';
import { useGlobalStyles } from '../../styles';
import { IconButton } from '../icon-button';
import { ChartHandler } from './chart';
import { Translation } from 'locales/utils';

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
      tooltipProps={{ title: Translation.get('button.chart.toolbar.save-as-image') }}
      variant='outlined'
    />
  );
};
