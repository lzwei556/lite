import React from 'react';
import { message, Space, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { IconButton, SaveIconButton } from '../../components';
import { Point } from './common';
import { useCanvasContext } from './context';

export type ToolbarProps = {
  onSave: (snapshot: { canvasSnapshot: Point[] }) => void;
  beforeUpload?: (image: string) => void;
  onUpload?: (image: string) => void;
  uploadedImageStr?: string;
};

export function Toolbar({ onSave, beforeUpload, onUpload, uploadedImageStr }: ToolbarProps) {
  const { points } = useCanvasContext();

  return (
    <Space>
      <Upload
        beforeUpload={(file) => {
          const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
          if (!isJpgOrPng) {
            message.error(Translation.get('feedback.prompt.upload.image'));
          } else {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const result = reader.result as string;
              beforeUpload?.(result);
            };
          }
          return false;
        }}
        showUploadList={false}
      >
        <IconButton
          icon={<PlusOutlined />}
          tooltipProps={{ title: Translation.doSth('common.action.upload', 'common.image') }}
        />
      </Upload>
      <SaveIconButton
        color='default'
        onClick={() => {
          onSave({ canvasSnapshot: points });
          if (uploadedImageStr) {
            onUpload?.(uploadedImageStr);
          }
        }}
        size='middle'
      />
    </Space>
  );
}
