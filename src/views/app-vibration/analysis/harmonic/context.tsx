import React from 'react';
import { ChartMark } from '../../../../components';
import { getNumsOfCursor, useMarkContext } from '../mark';

const HarmonicContext = React.createContext<{
  handleClick: (coord: [string, number], x: number[], y: number[], xIndex?: number) => void;
}>({
  handleClick: () => {}
});

export const Context = ({ children }: { children: React.ReactNode }) => {
  const { markType } = useMarkContext();
  const { dispatchMarks } = ChartMark.useContext();

  const getIndexs = React.useCallback((baseFrequencyIndex: number) => {
    const nums = getNumsOfCursor();
    return Array(nums.harmonic)
      .fill(-1)
      .map((n, index) => {
        return baseFrequencyIndex * (index + 1);
      });
  }, []);

  const handleClick = (coord: [string, number], x: number[], y: number[], xIndex?: number) => {
    if (xIndex) {
      dispatchMarks({ type: 'clear' });
      const indexs = getIndexs(xIndex);
      const _x = x.map((n) => `${n}`);
      indexs.forEach((index, i) => {
        const xValue = _x[index] ?? 'out.of.range';
        const yValue = y[index] ?? 'out.of.range';
        dispatchMarks({
          type: 'append_multiple',
          mark: {
            name: `${coord.join()}${i}`,
            data: [xValue, yValue],
            type: markType,
            chartPorps: { label: { formatter: i === 0 ? `${xValue}` : undefined } }
          }
        });
      });
    }
  };
  return <HarmonicContext.Provider value={{ handleClick }}>{children}</HarmonicContext.Provider>;
};

export const useContext = () => React.useContext(HarmonicContext);
