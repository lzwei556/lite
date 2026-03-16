import React from 'react';
import { message, Space, Upload } from 'antd';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { EditIconButton, IconButton, SaveIconButton } from '../../components';
import { Margin, Point } from './common';
import { useCanvasContext } from './context';

export function ToolbarLegacy({
  onSave,
  extras,
  beforeUpload,
  onCancel,
  onUpload,
  uploadedImageStr,
  viewIcon
}: {
  onSave: (snapshot: { canvasSnapshot: Point[] }) => void;
  extras?: React.ReactElement[];
  beforeUpload?: (image: string) => void;
  onCancel?: () => void;
  onUpload?: (image: string) => void;
  uploadedImageStr?: string;
  viewIcon?: React.ReactNode;
}) {
  const { points, setPoints, editable, setEditable } = useCanvasContext();
  const [prevPoints, setPrevPoints] = React.useState<Point[]>([]);

  return (
    <Space
      direction='vertical'
      style={{ position: 'absolute', zIndex: 2, right: Margin, bottom: Margin }}
    >
      {extras}
      {!editable && (
        <>
          {viewIcon}
          <EditIconButton
            onClick={() => {
              setPrevPoints(points);
              setEditable(true);
            }}
            size='middle'
            tooltipProps={{ title: Translation.get('common.action.edit'), placement: 'top' }}
          />
        </>
      )}
      {editable && (
        <>
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
              setEditable(false);
              setPrevPoints([]);
              onSave({ canvasSnapshot: points });
              if (uploadedImageStr) {
                onUpload?.(uploadedImageStr);
              }
            }}
            size='middle'
          />
          <IconButton
            icon={<CloseCircleOutlined />}
            onClick={() => {
              if (prevPoints.length > 0) {
                setPoints(prevPoints);
              }
              setEditable(false);
              onCancel?.();
            }}
            tooltipProps={{ title: Translation.get('common.action.cancel') }}
          />
        </>
      )}
    </Space>
  );
}
