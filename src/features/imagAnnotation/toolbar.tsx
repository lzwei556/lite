import React from 'react';
import { Button, Space } from 'antd';
import { CloseCircleOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { MARGIN, Point } from './common';
import { useCanvas } from './context';

export function Toolbar({ textSettingBtn }: { textSettingBtn: JSX.Element }) {
  const { ends, setEnds, editable, setEditable } = useCanvas();
  const [prevEnds, setPrevEnds] = React.useState<Point[]>([]);
  return (
    <Space
      direction='vertical'
      style={{ position: 'absolute', zIndex: 2, right: MARGIN, bottom: MARGIN }}
    >
      {!editable && (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setPrevEnds(ends);
              setEditable(true);
            }}
          />
          {textSettingBtn}
        </>
      )}
      {editable && (
        <>
          <Button
            icon={<SaveOutlined />}
            onClick={() => {
              setEditable(false);
              setPrevEnds([]);
              localStorage.setItem('canvas-snapshot', JSON.stringify(ends));
            }}
          />
          <Button
            icon={<CloseCircleOutlined />}
            onClick={() => {
              if (prevEnds.length > 0) {
                setEnds(prevEnds);
              }
              setEditable(false);
            }}
          />
        </>
      )}
    </Space>
  );
}
