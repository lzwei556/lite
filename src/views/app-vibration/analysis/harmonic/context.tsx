import React from 'react';
import { ChartMark } from '../../../../components';
import { useMarkContext } from '../mark';

export const nums = Array(50)
  .fill(-1)
  .map((n, index) => index + 1);

const HarmonicContext = React.createContext<{
  handleClick: (coord: [string, number], x: string[], y: number[], xIndex?: number) => void;
  num: number;
  setNum: React.Dispatch<React.SetStateAction<number>>;
  getIndexs: (index?: number) => number[];
}>({
  handleClick: () => {},
  num: nums[1],
  setNum: () => {},
  getIndexs: () => []
});

export const Context = ({ children }: { children: React.ReactNode }) => {
  const { markType } = useMarkContext();
  const { dispatchMarks } = ChartMark.useContext();
  const [num, setNum] = React.useState(8);
  const getIndexs = React.useCallback(
    (sideIndex?: number) => {
      return Array(num)
        .fill(-1)
        .map((n, index) => {
          return (sideIndex ?? 0) + 10 * index;
        });
    },
    [num]
  );
  const handleClick = (coord: [string, number], x: string[], y: number[], xIndex?: number) => {
    if (xIndex) {
      dispatchMarks({ type: 'clear' });
      const indexs = getIndexs(xIndex);
      indexs.forEach((index, i) => {
        const xValue = x[index];
        const yValue = y[index];
        dispatchMarks({
          type: 'append_multiple',
          mark: {
            name: `${coord.join()}${i}`,
            data: [xValue, yValue],
            type: markType
          }
        });
      });
    }
  };
  return (
    <HarmonicContext.Provider value={{ handleClick, num, setNum, getIndexs }}>
      {children}
    </HarmonicContext.Provider>
  );
};

export const useContext = () => React.useContext(HarmonicContext);
