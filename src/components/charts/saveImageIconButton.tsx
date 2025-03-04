import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { saveAsImage } from '../../utils/image';
import { ChartHandler } from './chart';

export const SaveImageIconButton = (props: { chartHandler: ChartHandler; filename?: string }) => {
  const { chartHandler, filename } = props;
  return (
    <Button
      color='primary'
      icon={<DownloadOutlined />}
      onClick={() => {
        const url = chartHandler.getInstance()?.getDataURL({ backgroundColor: '#fff' });
        if (url) {
          saveAsImage(url, `${filename ?? new Date().getTime()}.png`);
        }
      }}
      variant='filled'
    />
  );
};
