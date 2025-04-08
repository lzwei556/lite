import React from 'react';
import { ChartContext } from '../charts';
import { Mark } from './types';
import { isMarkLine } from './utils';

type AppendingMode = `append_${'single' | 'double' | 'multiple'}`;
type Action = {
  type: AppendingMode | 'remove' | 'change_label' | 'clear';
  mark?: Mark;
};
type Cursor = 'point' | 'line';
type ContextProps = {
  cursor: Cursor;
  setCursor: React.Dispatch<React.SetStateAction<Cursor>>;
  marks: Mark[];
  dispatchMarks: React.Dispatch<Action>;
  visibledMarks: Mark[];
};

const MarkContext = React.createContext<ContextProps>({} as ContextProps);

export const Context = ({
  children,
  initial
}: {
  children: JSX.Element;
  initial?: Pick<ContextProps, 'cursor' | 'marks'>;
}) => {
  const { cursor: initialCursor = 'point', marks: initialMarks = [] } = initial || {};
  const [cursor, setCursor] = React.useState<Cursor>(initialCursor);
  const [marks, dispatchMarks] = React.useReducer(marksReducer, initialMarks);
  const visibledMarks = getVisibledMarks(cursor, marks);
  return (
    <ChartContext>
      <MarkContext.Provider value={{ cursor, setCursor, marks, dispatchMarks, visibledMarks }}>
        {children}
      </MarkContext.Provider>
    </ChartContext>
  );
};

export const useContext = () => React.useContext(MarkContext);

function marksReducer(marks: Mark[], action: Action) {
  const { type, mark } = setDefaultLabel(marks, action);
  if (!mark) {
    return action.type === 'clear' ? [] : marks;
  }
  const { name, label } = mark;
  switch (type) {
    case 'append_single':
      return isMarkExisted(mark, marks) ? marks : [mark];
    case 'append_double':
      return isMarkExisted(mark, marks) ? marks : [...clipToSingle(marks), mark];
    case 'append_multiple':
      return isMarkExisted(mark, marks) ? marks : [...marks, mark];
    case 'remove':
      return marks
        .filter((mark) => mark.name !== name)
        .map((mark, i) => ({ ...mark, label: moveToPrev(i, mark.label) }));
    case 'change_label':
      return marks.map((mark) => {
        if (mark.name === name) {
          return { ...mark, label };
        } else {
          return mark;
        }
      });
    case 'clear':
      return [];
    default:
      return marks;
  }
}

function setDefaultLabel(marks: Mark[], action: Action): Action {
  const { mark } = action;
  if (!mark) {
    return action;
  }
  return { ...action, mark: { ...mark, label: mark.label ?? marks.length + 1 } };
}

function isMarkExisted(mark: Mark, marks: Mark[]) {
  return marks.map(({ name }) => name).includes(mark.name);
}

function clipToSingle(marks: Mark[]) {
  if (marks.length > 1) {
    marks.shift();
    return marks;
  } else {
    return marks;
  }
}

function moveToPrev(index: number, label?: string | number) {
  return typeof label === 'number' ? index + 1 : label;
}

function getVisibledMarks(cursor: Cursor, marks: Mark[]) {
  return marks
    .filter((mark) => (cursor === 'line' ? isMarkLine(mark) : !isMarkLine(mark)))
    .map((mark, i) => ({ ...mark, label: typeof mark.label === 'number' ? i + 1 : mark.label }));
}
