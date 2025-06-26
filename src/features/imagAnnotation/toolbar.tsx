import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { CloseCircleOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { MARGIN, Point } from './common';
import { useCanvas } from './context';

export function Toolbar({
  textSettingBtn,
  onSave,
  extras
}: {
  textSettingBtn: JSX.Element;
  onSave: (snapshot: { canvasSnapshot: Point[] }) => void;
  extras?: React.ReactElement[];
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
          <Tooltip title={intl.get('SAVE')}>
            <Button
              icon={<SaveOutlined />}
              onClick={() => {
                setEditable(false);
                setPrevEnds([]);
                onSave({ canvasSnapshot: ends });
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
              }}
            />
          </Tooltip>
        </>
      )}
    </Space>
  );
}
