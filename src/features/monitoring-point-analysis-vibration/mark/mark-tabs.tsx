import { Tabs } from 'components';
import React from 'react';
import { getMarkTypeLabel, MarkType, markTypes } from './mark-types';
import { MarkList } from './markList';

export const MarksTabs = ({
  markType,
  hiddens,
  faultMarkList
}: {
  markType: MarkType;
  hiddens?: MarkType[];
  faultMarkList?: React.ReactNode;
}) => {
  const [activeKey, setActiveKey] = React.useState(markType);
  const types = markTypes
    .filter((type) => !hiddens?.includes(type))
    .map((type) => ({
      key: type,
      label: getMarkTypeLabel(type as MarkType),
      children: activeKey === 'Faultfrequency' ? faultMarkList : <MarkList markType={type} />
    }));
  return (
    <Tabs
      activeKey={activeKey}
      items={types}
      size='small'
      onChange={(key) => setActiveKey(key as MarkType)}
    />
  );
};
