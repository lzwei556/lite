import React from 'react';
import { useLocaleContext } from '../../../../localeProvider';
import { ChartMark } from '../../../../components';
import { useMarkContext } from '../mark';

const cursors = ['center', 'side'] as const;
type Cursor = typeof cursors[number];
export const nums = [3, 5, 7, 9];

const CenterSideContext = React.createContext<{
  cursor: Cursor;
  setCursor: React.Dispatch<React.SetStateAction<Cursor>>;
  cursorOptions: { label: string; value: Cursor }[];
  handleClick: (coord: [string, number], x: number[], y: number[], xIndex?: number) => void;
  num: number;
  setNum: React.Dispatch<React.SetStateAction<number>>;
}>({
  cursor: 'center',
  setCursor: () => {},
  cursorOptions: [],
  handleClick: () => {},
  num: nums[1],
  setNum: () => {}
});

export const Context = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLocaleContext();
  const { markType } = useMarkContext();
  const [cursor, setCursor] = React.useState<Cursor>('center');
  const [num, setNum] = React.useState(nums[2]);
  const { visibledMarks, dispatchMarks } = ChartMark.useContext();
  const centeredMark = visibledMarks.find((mark) => mark.name.indexOf('center') > -1);
  const cursorOptions = cursors.map((c) => {
    return { label: c, value: c, disabled: c === 'side' && !centeredMark };
  });
  const getIndexs = (centerdIndex: number, sideIndex: number) => {
    const isLeft = sideIndex < centerdIndex;
    const offset = Math.abs(sideIndex - centerdIndex);
    const halfNum = (num - 1) / 2;
    const lefts: { index: number; label: string }[] = [];
    const rights: { index: number; label: string }[] = [];
    const left = language === 'zh-CN' ? '左' : 'Left';
    const right = language === 'zh-CN' ? '右' : 'Right';
    if (isLeft) {
      Array(halfNum)
        .fill(-1)
        .forEach((n, index) => {
          lefts.push({ index: sideIndex - offset * index, label: `${left}${index + 1}` });
        });
      Array(halfNum)
        .fill(-1)
        .forEach((n, index) => {
          rights.push({
            index: centerdIndex + offset * (index + 1),
            label: `${right}${index + 1}`
          });
        });
    } else {
      Array(halfNum)
        .fill(-1)
        .forEach((n, index) => {
          lefts.push({ index: centerdIndex - offset * (index + 1), label: `${left}${index + 1}` });
        });
      Array(halfNum)
        .fill(-1)
        .forEach((n, index) => {
          rights.push({ index: sideIndex + offset * index, label: `${right}${index + 1}` });
        });
    }
    return [...lefts, ...rights];
  };
  const handleClick = (coord: [string, number], x: number[], y: number[], xIndex?: number) => {
    if (cursor === 'center') {
      dispatchMarks({
        type: 'append_multiple',
        mark: {
          name: `${cursor}${coord.join()}`,
          label: language === 'zh-CN' ? '中心线' : 'Center',
          data: coord,
          type: markType,
          chartPorps: { itemStyle: { color: '#fa8c16' } }
        }
      });
      setCursor('side');
    } else if (centeredMark) {
      const sidedMarks = visibledMarks.filter((mark) => mark.name.indexOf('side') > -1);
      if (sidedMarks.length > 0) {
        //remove existed sides
        sidedMarks.forEach((mark) => dispatchMarks({ type: 'remove', mark }));
      }
      const _x = x.map((n) => `${n}`);
      const centeredIndex = _x.indexOf((centeredMark.data as [string, number])[0]);
      if (xIndex) {
        const indexs = getIndexs(centeredIndex, xIndex);
        indexs.forEach(({ index, label }, i) => {
          const xValue = _x[index] ?? 'out.of.range';
          const yValue = y[index] ?? 'out.of.range';
          dispatchMarks({
            type: 'append_multiple',
            mark: {
              name: `${cursor}${coord.join()}${i}`,
              label,
              data: [xValue, yValue],
              type: markType
            }
          });
        });
      }
    }
  };
  return (
    <CenterSideContext.Provider
      value={{ cursor, setCursor, cursorOptions, handleClick, num, setNum }}
    >
      {children}
    </CenterSideContext.Provider>
  );
};

export const useContext = () => React.useContext(CenterSideContext);
