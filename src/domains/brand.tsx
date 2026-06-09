import * as React from 'react';
import { Space } from 'antd';
import useImage from 'use-image';
import intl from 'react-intl-universal';
import { useGlobalStyles } from 'styles';
import { useAppConfig } from 'providers/app';

export const Brand = ({
  className,
  height,
  width,
  logoImgAlt,
  brandNameStyle,
  gap = 30
}: {
  className?: string;
  height?: number;
  width?: number;
  logoImgAlt?: string;
  brandNameStyle: React.CSSProperties;
  gap?: number;
}) => {
  const [image, status] = useImage('res/logo.png');
  const { colorWhiteStyle } = useGlobalStyles();

  return (
    <Space size={gap} className={className}>
      {status === 'loaded' && (
        <img
          src={image?.src}
          alt={logoImgAlt || 'logo'}
          style={{ width, height, display: 'block' }}
        />
      )}
      <strong style={{ ...brandNameStyle, ...colorWhiteStyle }} className='title'>
        {intl.get(useAppConfig().name)}
      </strong>
    </Space>
  );
};
