import React from 'react';
import { ChartMark } from '../../../../components';
import { roundValue } from '../../../../utils/format';
import CenterSide from '../centerSide';
import Harmon from '../harmonic';
import { useMarkContext } from './context';

export const useInitialMarks = (x: string[], y: number[]) => {
  const { dispatchMarks } = ChartMark.useContext();
  const { markType } = useMarkContext();
  const { getIndexs } = Harmon.useContext();
  React.useEffect(() => {
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
        const indexs = getIndexs();
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
      }
    }
  }, [markType, x, y, dispatchMarks, getIndexs]);
};

export const useMarkChartProps = () => {
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const { markType } = useMarkContext();
  const { handleClick: centerSideHandleClick } = CenterSide.useContext();
  const { handleClick: harmonHandleClick } = Harmon.useContext();

  const handleClick = React.useCallback(
    (coord: [string, number], x: string[], y: number[], xIndex?: number) => {
      const [xValue, yValue] = coord;
      if (markType === 'Peak') {
        dispatchMarks({
          type: 'append_single',
          mark: {
            name: coord.join(),
            data: coord,
            type: markType,
            style: { labelFormatter: `${xValue} ${roundValue(yValue)}` }
          }
        });
      } else if (markType === 'Double') {
        dispatchMarks({
          type: 'append_double',
          mark: {
            name: coord.join(),
            data: coord,
            type: markType,
            style: { labelFormatter: `${xValue} ${roundValue(yValue)}` }
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
  return {
    handleClick,
    marks: visibledMarks.filter((mark) => mark.type === markType),
    isTypeSideband: markType === 'Sideband'
  };
};
