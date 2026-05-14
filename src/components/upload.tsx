import React from 'react';
import { Upload as AntdUpload, UploadProps } from 'antd';
import { IconButton } from './icon-button';
import { UploadOutlined } from '@ant-design/icons';
import { ActionState } from 'common/action';
import { createSubmitHandler } from 'hooks/data';

type CustomRequestOptions = Parameters<NonNullable<UploadProps['customRequest']>>[0];

export const Upload: React.FC<UploadProps & ActionState<CustomRequestOptions['file']>> = ({
  action, //丢掉action，统一通过customRequest来处理
  children,
  showUploadList = false,
  loading,
  submit,
  ...rest
}) => {
  const handleCustomRequest: UploadProps['customRequest'] = async (options) => {
    const { file } = options;
    createSubmitHandler(submit)(file);
  };

  return (
    <AntdUpload {...rest} showUploadList={showUploadList} customRequest={handleCustomRequest}>
      {children ?? <IconButton icon={<UploadOutlined />} loading={loading} type='primary' />}
    </AntdUpload>
  );
};
