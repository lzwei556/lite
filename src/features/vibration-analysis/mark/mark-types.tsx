import { chartColors } from 'components';
import { ReactComponent as BookmarksSVG } from './bookmarks.svg';
import { ReactComponent as HarmonicSVG } from './harmonic.svg';
import { ReactComponent as ChecklistSVG } from './checklist.svg';
import { ReactComponent as BookmarkSVG } from './bookmark.svg';
import { ReactComponent as SidebandSVG } from './sideband.svg';
import { ReactComponent as Top10SVG } from './top10.svg';
import { ReactComponent as FaultFrequencySVG } from './faultFrequency.svg';
import { ColorDanger, ColorHealth, ColorWarn } from 'constants/color';
import intl from 'react-intl-universal';

export const editableMarkTypes = ['Peak', 'Double', 'Multiple', 'Harmonic', 'Sideband'] as const;
export const readonlyMarkTypes = ['Faultfrequency', 'Top10'] as const;

export type MarkType = (typeof editableMarkTypes)[number] | (typeof readonlyMarkTypes)[number];

export const markTypes: MarkType[] = [...editableMarkTypes, ...readonlyMarkTypes];

const markTypeTable: Record<MarkType, { color: string; icon: React.ComponentType }> = {
  Peak: { color: chartColors[1], icon: () => <BookmarkSVG /> },
  Double: { color: chartColors[3], icon: () => <BookmarksSVG /> },
  Multiple: { color: ColorHealth, icon: () => <ChecklistSVG /> },
  Harmonic: { color: '#592c1c', icon: () => <HarmonicSVG /> },
  Sideband: { color: ColorWarn, icon: () => <SidebandSVG /> },
  Faultfrequency: { color: ColorDanger, icon: () => <FaultFrequencySVG /> },
  Top10: { color: chartColors[0], icon: () => <Top10SVG /> }
};

export const getMarkTypeColor = (type: MarkType) => {
  return get(type).color;
};

export const getMarkTypeIcon = (type: MarkType) => {
  return get(type).icon;
};

export const getMarkTypeLabel = (type: MarkType) => {
  return intl.get(`analysis.vibration.cursor.${type.toLowerCase()}`);
};

const get = (type: MarkType) => markTypeTable[type];
