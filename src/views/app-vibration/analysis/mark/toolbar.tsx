import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import intl from 'react-intl-universal';
import { ChartMark } from '../../../../components';
import { MarkType, markTypes, useMarkContext } from './context';
import { ReactComponent as BookmarksSVG } from './bookmarks.svg';
import { ReactComponent as HarmonicSVG } from './harmonic.svg';
import { ReactComponent as ChecklistSVG } from './checklist.svg';
import { ReactComponent as BookmarkSVG } from './bookmark.svg';
import { ReactComponent as SidebandSVG } from './sideband.svg';
import { ReactComponent as Top10SVG } from './top10.svg';
import { ReactComponent as FaultFrequencySVG } from './faultFrequency.svg';
import Sideband from '../sideband';

const icons: { [Key in MarkType]: React.ComponentType } = {
  Peak: () => <BookmarkSVG />,
  Double: () => <BookmarksSVG />,
  Multiple: () => <ChecklistSVG />,
  Harmonic: () => <HarmonicSVG />,
  Sideband: () => <SidebandSVG />,
  Top10: () => <Top10SVG />,
  Faultfrequency: () => <FaultFrequencySVG />
};

export const Toolbar = ({ hiddens }: { hiddens?: MarkType[] }) => {
  const { dispatchMarks } = ChartMark.useContext();
  const { markType, setMarkType } = useMarkContext();
  const { cursor, setCursor } = Sideband.useContext();

  return (
    <Space size={4}>
      {markTypes
        .filter((type) => !hiddens?.includes(type))
        .map((type) => {
          return (
            <Tooltip key={type} title={intl.get(`analysis.vibration.cursor.${type.toLowerCase()}`)}>
              <Button
                color='primary'
                onClick={() => {
                  setMarkType(type);
                  if (markType === 'Sideband' && cursor === 'side') {
                    setCursor('center');
                  }
                  if (type !== markType) {
                    dispatchMarks({ type: 'clear' });
                  }
                }}
                icon={<Icon component={icons[type]} />}
                variant={type === markType ? 'solid' : 'outlined'}
                size='small'
              />
            </Tooltip>
          );
        })}
    </Space>
  );
};
