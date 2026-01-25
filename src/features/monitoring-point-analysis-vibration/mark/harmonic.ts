import { ChartMark } from 'components';
import { HarmonicData } from 'asset-common';
import { getLineStyles, MarkParams } from './hooks';
import { getValue } from 'utils';
import intl from 'react-intl-universal';

export const trigger = ({
  x,
  y,
  indexs,
  dispatchMarks,
  topY,
  property
}: MarkParams & {
  indexs: number[];
  dispatchMarks: ChartMark.DispathMark;
  topY: number;
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
        data: [
          [`${xValue}`, yValue],
          [`${xValue}`, topY]
        ],
        type: markType,
        chartProps: getLineStyles(
          markType,
          `${intl.get(`harmonic.${i + 1}x`)}\r\n${xValue} Hz\r\n${getValue({
            value: yValue,
            unit: property?.unit
          })}`
        )
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

export const getHarmonic = ({ harmonic, x, y }: MarkParams) => {
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
    ].map((index) => {
      const xValue = x[index] ?? -1;
      const yValue = y[index] ?? -1;
      return [xValue, yValue];
    });
  }
  return [];
};
