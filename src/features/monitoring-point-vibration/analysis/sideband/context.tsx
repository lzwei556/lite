import React from 'react';
import { ChartMark } from '../../../../components';
import { useGlobalStyles } from '../../../../styles';
import { getNumsOfCursor, useMarkContext } from '../mark';

export const cursors = ['center', 'side'] as const;
export type Cursor = typeof cursors[number];

const SidebandContext = React.createContext<{
  cursor: Cursor;
  setCursor: React.Dispatch<React.SetStateAction<Cursor>>;
  centeredIndex?: number;
  setCenteredIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  triggerCenter: (coord: [string, number]) => void;
  clearSideMarks: () => void;
  triggerSide: (indexs: { index: number; label: string }[], x: number[], y: number[]) => void;
  reset: () => void;
}>({
  cursor: 'center',
  setCursor: () => {},
  centeredIndex: undefined,
  setCenteredIndex: () => {},
  triggerCenter: () => {},
  clearSideMarks: () => {},
  triggerSide: () => {},
  reset: () => {}
});

export const Context = ({ children }: { children: React.ReactNode }) => {
  const [cursor, setCursor] = React.useState<Cursor>('center');
  const [centeredIndex, setCenteredIndex] = React.useState<number>();
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const { markType } = useMarkContext();
  const { colorWarningStyle } = useGlobalStyles();
  const triggerCenter = React.useCallback(
    (coord: [string, number]) => {
      if (cursor === 'center') {
        dispatchMarks({
          type: 'append_multiple',
          mark: {
            name: `${cursor}${coord.join()}`,
            label: 'sideband.center',
            data: coord,
            type: markType,
            chartProps: { itemStyle: colorWarningStyle }
          }
        });
        setCursor('side');
      }
    },
    [cursor, dispatchMarks, markType]
  );

  const clearSideMarks = React.useCallback(() => {
    const sidedMarks = visibledMarks.filter((mark) => mark.name.indexOf('side') > -1);
    if (sidedMarks.length > 0) {
      //remove existed sides
      sidedMarks.forEach((mark) => dispatchMarks({ type: 'remove', mark }));
    }
  }, [dispatchMarks, visibledMarks]);

  const triggerSide = React.useCallback(
    (indexs: { index: number; label: string }[], x: number[], y: number[]) => {
      indexs.forEach(({ index, label }, i) => {
        const xValue = x[index] ?? 'out.of.range';
        const yValue = y[index] ?? 'out.of.range';
        dispatchMarks({
          type: 'append_multiple',
          mark: {
            name: `${'side'}${[`${xValue}`, yValue].join()}${i}`,
            label,
            data: [`${xValue}`, yValue],
            type: markType
          }
        });
      });
    },
    [dispatchMarks, markType]
  );

  const reset = React.useCallback(() => {
    setCursor('center');
    setCenteredIndex(undefined);
    dispatchMarks({ type: 'clear' });
  }, [dispatchMarks]);

  return (
    <SidebandContext.Provider
      value={{
        cursor,
        setCursor,
        centeredIndex,
        setCenteredIndex,
        triggerCenter,
        clearSideMarks,
        triggerSide,
        reset
      }}
    >
      {children}
    </SidebandContext.Provider>
  );
};

export const useContext = () => React.useContext(SidebandContext);

export const getIndexs = ({
  centeredIndex,
  sideIndex
}: {
  centeredIndex: number;
  sideIndex: number;
}) => {
  const isLeft = sideIndex < centeredIndex;
  const offset = Math.abs(sideIndex - centeredIndex);
  const nums = getNumsOfCursor();
  const halfNum = (nums.sideband - 1) / 2;
  const lefts: { index: number; label: string }[] = [];
  const rights: { index: number; label: string }[] = [];
  const left = 'sideband.left';
  const right = 'sideband.right';
  if (isLeft) {
    Array(halfNum)
      .fill(-1)
      .forEach((n, index) => {
        lefts.push({ index: sideIndex - offset * index, label: `${left}.${index + 1}` });
      });
    Array(halfNum)
      .fill(-1)
      .forEach((n, index) => {
        rights.push({
          index: centeredIndex + offset * (index + 1),
          label: `${right}.${index + 1}`
        });
      });
  } else {
    Array(halfNum)
      .fill(-1)
      .forEach((n, index) => {
        lefts.push({ index: centeredIndex - offset * (index + 1), label: `${left}.${index + 1}` });
      });
    Array(halfNum)
      .fill(-1)
      .forEach((n, index) => {
        rights.push({ index: sideIndex + offset * index, label: `${right}.${index + 1}` });
      });
  }
  return [...lefts, ...rights];
};
