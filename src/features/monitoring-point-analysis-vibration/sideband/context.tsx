import React from 'react';
import { ChartMark } from 'components';
import { getLineStyles, getMarkTypeLabel } from '../mark';
import { Property } from '../useTrend';
import intl from 'react-intl-universal';
import { getValue } from 'utils';

export const cursors = ['center', 'side'] as const;
export type Cursor = (typeof cursors)[number];

const SidebandContext = React.createContext<{
  cursor: Cursor;
  setCursor: React.Dispatch<React.SetStateAction<Cursor>>;
  centeredIndex?: number;
  setCenteredIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  triggerCenter: (
    coord: [string, number],
    topY: number,
    centeredIndex: number,
    property?: Property
  ) => void;
  triggerSide: (
    indexs: { index: number; label: string }[],
    x: number[],
    y: number[],
    topY: number
  ) => void;
  reset: () => void;
}>({
  cursor: 'center',
  setCursor: () => {},
  centeredIndex: undefined,
  setCenteredIndex: () => {},
  triggerCenter: () => {},
  triggerSide: () => {},
  reset: () => {}
});

export const Context = ({ children }: { children: React.ReactNode }) => {
  const [cursor, setCursor] = React.useState<Cursor>('center');
  const [centeredIndex, setCenteredIndex] = React.useState<number>();
  const { dispatchMarks } = ChartMark.useContext();
  const markType = 'Sideband';

  const clearMarks = React.useCallback(
    (cursor: Cursor) => {
      dispatchMarks({ type: 'remove_by_name', removeNames: [cursor] });
    },
    [dispatchMarks]
  );

  const triggerCenter = React.useCallback(
    (coord: [string, number], topY: number, centeredIndex: number, property?: Property) => {
      dispatchMarks({ type: 'remove_by_type', removeTypes: ['Sideband'] });
      dispatchMarks({
        type: 'append_multiple',
        mark: {
          name: `center${coord.join()}`,
          label: 'sideband.center',
          data: [coord, [coord[0], topY]],
          type: markType,
          chartProps: getLineStyles(
            markType,
            `${getMarkTypeLabel('Sideband')}\r\n${coord[0]} Hz\r\n${getValue({
              value: coord[1],
              unit: property?.unit
            })}`
          )
        }
      });
      setCenteredIndex(centeredIndex);
      setCursor('side');
    },
    [dispatchMarks, markType]
  );

  const triggerSide = React.useCallback(
    (indexs: { index: number; label: string }[], x: number[], y: number[], topY: number) => {
      clearMarks('side');
      indexs.forEach(({ index, label }, i) => {
        const xValue = x[index] ?? 'out.of.range';
        const yValue = y[index] ?? 'out.of.range';
        dispatchMarks({
          type: 'append_multiple',
          mark: {
            name: `side${[`${xValue}`, yValue].join()}${i}`,
            label,
            data: [
              [`${xValue}`, yValue],
              [`${xValue}`, topY]
            ],
            type: markType,
            chartProps: getLineStyles(markType)
          }
        });
      });
    },
    [dispatchMarks, markType, clearMarks]
  );

  const reset = React.useCallback(() => {
    setCursor('center');
    setCenteredIndex(undefined);
    dispatchMarks({ type: 'remove_by_type', removeTypes: ['Sideband'] });
  }, [dispatchMarks]);

  return (
    <SidebandContext.Provider
      value={{
        cursor,
        setCursor,
        centeredIndex,
        setCenteredIndex,
        triggerCenter,
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
  cursor,
  centeredIndex,
  sideIndex
}: {
  cursor: number;
  centeredIndex: number;
  sideIndex: number;
}) => {
  const isLeft = sideIndex < centeredIndex;
  const offset = Math.abs(sideIndex - centeredIndex);
  const halfNum = (cursor - 1) / 2;
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
