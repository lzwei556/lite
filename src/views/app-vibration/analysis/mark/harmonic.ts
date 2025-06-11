import { ChartMark } from '../../../../components';
import { HarmonicData } from '../../../asset-common';
import { MarkType } from './context';
import { getNumsOfCursor } from './configurableNumsOfCursor';

export const trigger = ({
  x,
  y,
  indexs,
  dispatchMarks,
  markType
}: {
  x: number[];
  y: number[];
  indexs: number[];
  dispatchMarks: ChartMark.DispathMark;
  markType: MarkType;
}) => {
  dispatchMarks({ type: 'clear' });
  indexs.forEach((index, i) => {
    const xValue = x[index] ?? 'out.of.range';
    const yValue = y[index] ?? 'out.of.range';
    dispatchMarks({
      type: 'append_multiple',
      mark: {
        name: `${xValue}${yValue}${i}`,
        data: [`${xValue}`, yValue],
        type: markType,
        chartPorps: { label: { formatter: i === 0 ? `${xValue}` : undefined } }
      }
    });
  });
};

export const getIndexs = ({
  harmonic,
  baseFrequencyIndex
}: {
  harmonic?: HarmonicData;
  baseFrequencyIndex?: number;
}) => {
  const nums = getNumsOfCursor();
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
    ].filter((n, index) => index < nums.harmonic);
  }
  if (baseFrequencyIndex) {
    return Array(nums.harmonic)
      .fill(-1)
      .map((n, index) => {
        return baseFrequencyIndex * (index + 1);
      });
  }
  return [];
};
