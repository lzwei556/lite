import React from 'react';
import { ChartMark } from '../../../../components';
import { roundValue } from '../../../../utils/format';
import { Harmonic } from '../../../asset-common';
import CenterSide from '../centerSide';
import Harmon from '../harmonic';
import { useMarkContext } from './context';

export const useMarkChartProps = () => {
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const { markType } = useMarkContext();
  const { handleClick: centerSideHandleClick, setCursor } = CenterSide.useContext();
  const { handleClick: harmonHandleClick, getIndexs } = Harmon.useContext();

  const handleClick = React.useCallback(
    (coord: [string, number], x: string[], y: number[], xIndex?: number) => {
      const [xValue, yValue] = coord;
      if (markType === 'Peak' || markType === 'Double') {
        dispatchMarks({
          type: markType === 'Peak' ? 'append_single' : 'append_double',
          mark: {
            name: coord.join(),
            data: coord,
            type: markType,
            chartPorps: { label: { formatter: `${xValue} ${roundValue(yValue)}` } }
          }
        });
      } else if (markType === 'Multiple') {
        dispatchMarks({
          type: 'append_multiple',
          mark: {
            name: coord.join(),
            data: coord,
            type: markType,
            value: `${xValue} ${roundValue(yValue)}`
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
    (x: string[], y: number[], harmonic?: Harmonic) => {
      if (markType === 'Peak' || markType === 'Double') {
        dispatchMarks({
          type: 'append_single',
          mark: {
            name: `${[x[0], y[0]].join()}${markType}`,
            label: markType,
            data: [x[0], y[0]],
            type: markType
          }
        });
      } else {
        dispatchMarks({ type: 'clear' });
        if (markType === 'Harmonic') {
          const indexs = harmonic ? getIndexsByHarmonic(harmonic, y) : getIndexs();
          indexs.forEach((index, i) => {
            const xValue = x[index];
            const yValue = y[index];
            dispatchMarks({
              type: 'append_multiple',
              mark: {
                name: `${xValue}${yValue}${i}`,
                data: [xValue, yValue],
                type: markType
              }
            });
          });
        } else if (markType === 'Top10') {
          Array(10)
            .fill(-1)
            .forEach((n, index) => {
              const xValue = x[index];
              const yValue = y[index];
              dispatchMarks({
                type: 'append_multiple',
                mark: {
                  name: `${xValue}${yValue}${index}`,
                  data: [xValue, yValue],
                  type: markType
                }
              });
            });
        } else if (markType === 'Sideband') {
          setCursor('center');
        }
      }
    },
    [markType, dispatchMarks, setCursor, getIndexs]
  );

  return {
    handleClick,
    handleRefresh,
    marks: visibledMarks.filter((mark) => mark.type === markType),
    isTypeSideband: markType === 'Sideband'
  };
};

const getIndexsByHarmonic = (harmonic: Harmonic, y: number[]) => {
  return [
    harmonic.harmonic1x,
    harmonic.harmonic2x,
    harmonic.harmonic3x,
    harmonic.harmonic4x,
    harmonic.harmonic5x,
    harmonic.harmonic6x,
    harmonic.harmonic7x,
    harmonic.harmonic8x,
    harmonic.harmonic9x,
    harmonic.harmonic10x
  ].map((v) => y.indexOf(v));
};
