import React from 'react';
import { Button, Tooltip } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { saveAsImage } from '../../utils/image';
import { ChartHandler } from './chart';

export const SaveImageIconButton = (props: { chartHandler: ChartHandler; filename?: string }) => {
  const { chartHandler, filename } = props;
  return (
    <Tooltip title={intl.get('analysis.save.as.image')}>
      <Button
        color='primary'
        icon={<PictureOutlined />}
        onClick={() => {
          const url = chartHandler.getInstance()?.getDataURL({ backgroundColor: '#fff' });
          if (url) {
            saveAsImage(url, `${filename ?? new Date().getTime()}.png`);
          }
        }}
        variant='outlined'
        size='small'
      />
    </Tooltip>
  );
};
