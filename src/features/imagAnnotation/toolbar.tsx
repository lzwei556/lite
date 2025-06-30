import React from 'react';
import { Button, message, Space, Tooltip, Upload } from 'antd';
import { CloseCircleOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
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
          <Tooltip title={intl.get('EDIT')}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setPrevEnds(ends);
                setEditable(true);
              }}
            />
          </Tooltip>
          {textSettingBtn}
        </>
      )}
      {editable && (
        <>
          <Tooltip title={intl.get('replace.image')}>
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
              <Button icon={<PlusOutlined />} />
            </Upload>
          </Tooltip>
          <Tooltip title={intl.get('SAVE')}>
            <Button
              icon={<SaveOutlined />}
              onClick={() => {
                setEditable(false);
                setPrevEnds([]);
                onSave({ canvasSnapshot: ends });
                if (uploadedImageStr) {
                  onUpload?.(uploadedImageStr);
                }
              }}
            />
          </Tooltip>
          <Tooltip title={intl.get('CANCEL')}>
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => {
                if (prevEnds.length > 0) {
                  setEnds(prevEnds);
                }
                setEditable(false);
                onCancel?.();
              }}
            />
          </Tooltip>
        </>
      )}
    </Space>
  );
}
