import React from 'react';
import { message, Space, Upload } from 'antd';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { EditIconButton, IconButton, SaveIconButton } from '../../components';
import { MARGIN, Point } from './common';
import { useCanvas } from './context';

export function Toolbar({
  textSettingBtn,
  onSave,
  extras,
  beforeUpload,
  onCancel,
  onUpload,
  uploadedImageStr
}: {
  textSettingBtn: JSX.Element;
  onSave: (snapshot: { canvasSnapshot: Point[] }) => void;
  extras?: React.ReactElement[];
  beforeUpload?: (image: string) => void;
  onCancel?: () => void;
  onUpload?: (image: string) => void;
  uploadedImageStr?: string;
}) {
  const { ends, setEnds, editable, setEditable } = useCanvas();
  const [prevEnds, setPrevEnds] = React.useState<Point[]>([]);

  return (
    <Space
      direction='vertical'
      style={{ position: 'absolute', zIndex: 2, right: MARGIN, bottom: MARGIN }}
    >
      {extras}
      {!editable && (
        <>
          <EditIconButton
            onClick={() => {
              setPrevEnds(ends);
              setEditable(true);
            }}
            size='middle'
            tooltipProps={{ title: intl.get('EDIT'), placement: 'top' }}
          />
          {textSettingBtn}
        </>
      )}
      {editable && (
        <>
          <Upload
            beforeUpload={(file) => {
              const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
              if (!isJpgOrPng) {
                message.error(intl.get('only.jpeg.or.png'));
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
              tooltipProps={{ title: intl.get('replace.image') }}
            />
          </Upload>
          <SaveIconButton
            color='default'
            onClick={() => {
              setEditable(false);
              setPrevEnds([]);
              onSave({ canvasSnapshot: ends });
              if (uploadedImageStr) {
                onUpload?.(uploadedImageStr);
              }
            }}
            size='middle'
          />
          <IconButton
            icon={<CloseCircleOutlined />}
            onClick={() => {
              if (prevEnds.length > 0) {
                setEnds(prevEnds);
              }
              setEditable(false);
              onCancel?.();
            }}
            tooltipProps={{ title: intl.get('CANCEL') }}
          />
        </>
      )}
    </Space>
  );
}
