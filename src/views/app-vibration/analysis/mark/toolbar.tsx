import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import intl from 'react-intl-universal';
import { MarkType, markTypes, useMarkContext } from './context';
import { ReactComponent as DoubleSVG } from './double.svg';
import { ReactComponent as HarmonicSVG } from './harmonic.svg';
import { ReactComponent as MultipleSVG } from './multiple.svg';
import { ReactComponent as PeakSVG } from './peak.svg';
import { ReactComponent as SidebandSVG } from './sideband.svg';
import { ReactComponent as Top10SVG } from './top10.svg';
import centerSide from '../centerSide';

const icons: { [Key in MarkType]: React.ComponentType } = {
  Peak: () => <PeakSVG />,
  Double: () => <DoubleSVG />,
  Multiple: () => <MultipleSVG />,
  Harmonic: () => <HarmonicSVG />,
  Sideband: () => <SidebandSVG />,
  Top10: () => <Top10SVG />
};

export const Toolbar = ({ hiddens }: { hiddens?: MarkType[] }) => {
  const { markType, setMarkType } = useMarkContext();
  const { cursor, setCursor } = centerSide.useContext();

  return (
    <Space>
      {markTypes
        .filter((type) => !hiddens?.includes(type))
        .map((type) => {
          return (
            <Tooltip title={intl.get(`analysis.vibration.cursor.${type.toLowerCase()}`)}>
              <Button
                key={type}
                color='primary'
                onClick={() => {
                  setMarkType(type);
                  if (markType === 'Sideband' && cursor === 'side') {
                    setCursor('center');
                  }
                }}
                icon={<Icon component={icons[type]} />}
                variant={type === markType ? 'solid' : 'filled'}
              />
            </Tooltip>
          );
        })}
    </Space>
  );
};
