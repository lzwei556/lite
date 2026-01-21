import { ChartMark } from 'components';
import { HarmonicData } from 'asset-common';
import { getMarkTypeColor } from './mark-types';

export const trigger = ({
  x,
  y,
  indexs,
  dispatchMarks
}: {
  x: number[];
  y: number[];
  indexs: number[];
  dispatchMarks: ChartMark.DispathMark;
}) => {
  const markType = 'Harmonic';
  dispatchMarks({ type: 'remove_by_type', removeTypes: [markType] });
  indexs.forEach((index, i) => {
    const xValue = x[index] ?? 'out.of.range';
    const yValue = y[index] ?? 'out.of.range';
    dispatchMarks({
      type: 'append_multiple',
      mark: {
        name: `${xValue}${yValue}${i}`,
        data: [`${xValue}`, yValue],
        type: markType,
        chartProps: {
          label: { formatter: i === 0 ? `${xValue}` : undefined },
          itemStyle: { color: getMarkTypeColor(markType) }
        }
      }
    });
  });
};

export const getIndexs = ({
  cursor,
  harmonic,
  baseFrequencyIndex
}: {
  cursor: number;
  harmonic?: HarmonicData;
  baseFrequencyIndex?: number;
}) => {
  if (harmonic) {
    return [
      harmonic.harmonic1XIndex,
      harmonic.harmonic2XIndex,
      harmonic.harmonic3XIndex,
      harmonic.harmonic4XIndex,
      harmonic.harmonic5XIndex,
      harmonic.harmonic6XIndex,
      harmonic.harmonic7XIndex,
      harmonic.harmonic8XIndex,
      harmonic.harmonic9XIndex,
      harmonic.harmonic10XIndex
    ].filter((n, index) => index < cursor);
  }
  if (baseFrequencyIndex) {
    return Array(cursor)
      .fill(-1)
      .map((n, index) => {
        return baseFrequencyIndex * (index + 1);
      });
  }
  return [];
};
