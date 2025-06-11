import React from 'react';
import { formatNumericData } from '../../../../utils/format';
import { ChartMark } from '../../../../components';
import { HarmonicData } from '../../../asset-common';
import Sideband from '../sideband';
import { useMarkContext } from './context';
import * as Harmonic from './harmonic';

export const useMarkChartProps = () => {
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const { markType } = useMarkContext();
  const { centeredIndex, setCenteredIndex, triggerCenter, clearSideMarks, triggerSide, reset } =
    Sideband.useContext();

  const handleClick = React.useCallback(
    (coord: [string, number], x: number[], y: number[], xIndex?: number) => {
      const [xValue, yValue] = coord.map(formatNumericData);
      if (markType === 'Peak' || markType === 'Double') {
        dispatchMarks({
          type: markType === 'Peak' ? 'append_single' : 'append_double',
          mark: {
            name: coord.join(),
            data: coord,
            type: markType,
            chartPorps: { label: { formatter: `${xValue} ${yValue}` } }
          }
        });
      } else if (markType === 'Multiple') {
        dispatchMarks({
          type: 'append_multiple',
          mark: {
            name: coord.join(),
            data: coord,
            type: markType,
            value: `${xValue} ${yValue}`
          }
        });
      } else if (markType === 'Sideband') {
        if (xIndex) {
          triggerCenter(coord);
          if (centeredIndex) {
            clearSideMarks();
            triggerSide(Sideband.getIndexs({ centeredIndex, sideIndex: xIndex }), x, y);
          } else {
            setCenteredIndex(xIndex);
          }
        }
      } else if (markType === 'Harmonic') {
        Harmonic.trigger({
          x,
          y,
          indexs: Harmonic.getIndexs({ baseFrequencyIndex: xIndex }),
          dispatchMarks,
          markType
        });
      }
    },
    [
      markType,
      dispatchMarks,
      centeredIndex,
      setCenteredIndex,
      triggerCenter,
      triggerSide,
      clearSideMarks
    ]
  );

  const handleRefresh = React.useCallback(
    (
      x: number[],
      y: number[],
      initial?: { harmonic?: HarmonicData; faultFrequencies?: { label: string; value: number }[] }
    ) => {
      if (markType === 'Peak' || markType === 'Double') {
        dispatchMarks({
          type: 'append_single',
          mark: {
            name: `${[`${x[0]}`, y[0]].join()}${markType}`,
            label: markType,
            data: [`${x[0]}`, y[0]],
            type: markType
          }
        });
      } else if (markType === 'Multiple') {
        dispatchMarks({ type: 'clear' });
      } else if (markType === 'Harmonic') {
        Harmonic.trigger({
          x,
          y,
          indexs: Harmonic.getIndexs({ harmonic: initial?.harmonic }),
          dispatchMarks,
          markType
        });
      } else if (markType === 'Top10' && y.length >= 10) {
        dispatchMarks({ type: 'clear' });
        const top10 = [...y].sort((a, b) => b - a).slice(0, 10);
        top10.forEach((n, index) => {
          const xValue = `${x[y.indexOf(n)]}`;
          const yValue = n;
          dispatchMarks({
            type: 'append_multiple',
            mark: {
              name: `${xValue}${yValue}${index}`,
              data: [xValue, yValue],
              type: markType,
              chartPorps: { default: true }
            }
          });
        });
      } else if (markType === 'Sideband') {
        reset();
        if (initial?.harmonic) {
          // const centeredIndex = initial.harmonic.harmonic1XIndex;
          // const xValue = x[centeredIndex];
          // const yValue = y[centeredIndex];
          // let sideIndex = centeredIndex;
          // triggerCenter([`${xValue}`, yValue]);
          // triggerSide(Sideband.getIndexs({ centeredIndex, sideIndex }), x, y);
        }
      } else if (markType === 'Faultfrequency') {
        (initial?.faultFrequencies ?? []).forEach(({ label, value }) => {
          const index = y.indexOf(value);
          if (index !== -1) {
            const xValue = `${x[index]}`;
            dispatchMarks({
              type: 'append_multiple',
              mark: {
                name: `${xValue}${value}`,
                data: [xValue, value],
                type: markType,
                chartPorps: { label: { formatter: label } }
              }
            });
          }
        });
      }
    },
    [markType, dispatchMarks, reset]
  );

  return {
    handleClick,
    handleRefresh,
    marks: visibledMarks.filter((mark) => mark.type === markType),
    isTypeSideband: markType === 'Sideband',
    markType
  };
};
