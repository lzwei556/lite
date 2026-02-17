import React from 'react';
import { Space } from 'antd';
import Icon from '@ant-design/icons';
import { IconButton } from 'components';
import { useMarkContext } from './context';
import Sideband from '../sideband';
import { editableMarkTypes, getMarkTypeIcon, getMarkTypeLabel, MarkType } from './mark-types';

export const Toolbar = ({ hiddens }: { hiddens?: MarkType[] }) => {
  const { markType, setMarkType } = useMarkContext();
  const { cursor, setCursor } = Sideband.useContext();

  return (
    <Space size={4}>
      {editableMarkTypes
        .filter((type) => !hiddens?.includes(type))
        .map((type) => {
          return (
            <IconButton
              key={type}
              color='primary'
              onClick={() => {
                setMarkType(type);
                if (markType === 'Sideband' && cursor === 'side') {
                  setCursor('center');
                }
              }}
              icon={<Icon component={getMarkTypeIcon(type)} />}
              size='small'
              tooltipProps={{ title: getMarkTypeLabel(type) }}
              variant={type === markType ? 'solid' : 'outlined'}
            />
          );
        })}
    </Space>
  );
};
