import React from 'react';
import { formatNumericData } from '../../../../utils/format';
import { ChartMark } from '../../../../components';
import { Harmonic } from '../../../asset-common';
import CenterSide from '../centerSide';
import Harmon from '../harmonic';
import { useMarkContext } from './context';
import { getNumsOfCursor } from './configurableNumsOfCursor';

export const useMarkChartProps = () => {
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const { markType } = useMarkContext();
  const { handleClick: centerSideHandleClick, setCursor } = CenterSide.useContext();
  const { handleClick: harmonHandleClick } = Harmon.useContext();

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
        centerSideHandleClick(coord, x, y, xIndex);
      } else if (markType === 'Harmonic') {
        harmonHandleClick(coord, x, y, xIndex);
      }
    },
    [markType, dispatchMarks, centerSideHandleClick, harmonHandleClick]
  );

  const handleRefresh = React.useCallback(
    (
      x: number[],
      y: number[],
      initial?: { harmonic?: Harmonic; faultFrequencies?: { label: string; value: number }[] }
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
      } else {
        dispatchMarks({ type: 'clear' });
        if (markType === 'Harmonic') {
          const indexs = getIndexsByHarmonic(initial?.harmonic);
          indexs.forEach((index, i) => {
            const xValue = `${x[index]}`;
            const yValue = y[index];
            dispatchMarks({
              type: 'append_multiple',
              mark: {
                name: `${xValue}${yValue}${i}`,
                data: [xValue, yValue],
                type: markType,
                chartPorps: { label: { formatter: i === 0 ? `${xValue}` : undefined } }
              }
            });
          });
        } else if (markType === 'Top10' && y.length >= 10) {
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
          setCursor('center');
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
      }
    },
    [markType, dispatchMarks, setCursor]
  );

  return {
    handleClick,
    handleRefresh,
    marks: visibledMarks.filter((mark) => mark.type === markType),
    isTypeSideband: markType === 'Sideband',
    markType
  };
};

const getIndexsByHarmonic = (harmonic?: Harmonic) => {
  if (!harmonic) return [];
  const nums = getNumsOfCursor();
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
};
