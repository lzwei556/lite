import React from 'react';
import { ChartContext } from '../charts';
import { Mark } from './types';

type AppendingMode = `append_${'single' | 'double' | 'multiple'}`;
type Action = {
  type: AppendingMode | 'remove' | 'remove_by_type' | 'change_label' | 'clear';
  mark?: Mark;
  removeTypes?: string[];
};
type ContextProps = {
  marks: Mark[];
  dispatchMarks: React.Dispatch<Action>;
};
export type DispathMark = React.Dispatch<Action>;

const MarkContext = React.createContext<ContextProps>({} as ContextProps);

export const Context = ({
  children,
  initial = []
}: {
  children: JSX.Element;
  initial?: Mark[];
}) => {
  const [marks, dispatchMarks] = React.useReducer(marksReducer, initial);
  console.log('marks', marks);

  return (
    <ChartContext>
      <MarkContext.Provider value={{ marks, dispatchMarks }}>{children}</MarkContext.Provider>
    </ChartContext>
  );
};

export const useContext = () => React.useContext(MarkContext);

function marksReducer(marks: Mark[], action: Action) {
  const { type, mark } = setDefaultLabel(marks, action);
  const isMarkInvalid = isMarkExisted(marks, mark) || !mark;
  switch (type) {
    case 'append_single':
      return isMarkInvalid ? marks : [...marks.filter((m) => m.type !== mark.type), mark];
    case 'append_double':
      return isMarkInvalid
        ? marks
        : [
            ...marks.filter((m) => m.type !== mark.type),
            ...clipToSingle(marks.filter((m) => m.type === mark.type)),
            mark
          ];
    case 'append_multiple':
      return isMarkInvalid ? marks : [...marks, mark];
    case 'remove':
      return marks
        .filter((m) => m.type !== mark?.type)
        .concat(
          marks
            .filter((m) => (mark ? mark.name !== m.name && mark.type === m.type : true))
            .map((mark, i) => ({ ...mark, label: moveToPrev(i, mark.label) }))
        );
    case 'remove_by_type':
      return marks
        .filter((mark) => !action.removeTypes?.includes(mark.type))
        // .map((mark, i) => ({ ...mark, label: moveToPrev(i, mark.label) }));
    case 'change_label':
      return marks.map((m) => {
        if (mark && mark.name === m.name) {
          return { ...m, label: mark.label };
        } else {
          return m;
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
  return {
    ...action,
    mark: { ...mark, label: mark.label ?? marks.filter((m) => m.type === mark.type).length + 1 }
  };
}

function isMarkExisted(marks: Mark[], mark?: Mark) {
  return mark && marks.find((m) => m.name === mark.name && m.type === mark.type);
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
