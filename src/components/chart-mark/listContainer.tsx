import React from 'react';
import { Card, CardProps } from '../card';
import { useChartContext } from '../charts';
import { List } from './components/list';
import { useContext } from './context';
import { brushAreas } from './utils';

export const ListContainer = ({ cardProps }: { cardProps?: CardProps }) => {
  const ref = useChartContext();
  const { visibledMarks, dispatchMarks } = useContext();
  return (
    <Card styles={{ body: { overflowY: 'auto', maxHeight: 350 } }} {...cardProps}>
      <List
        items={visibledMarks.map((mark) => {
          const onChange = (input: string) => {
            if (input.length > 0) {
              dispatchMarks({ type: 'change_label', mark: { ...mark, label: input } });
            }
          };
          const onRemove = () => {
            dispatchMarks({ type: 'remove', mark });
            brushAreas(
              visibledMarks.filter((m) => m.name !== mark.name),
              ref.current.getInstance()
            );
          };
          return { ...mark, onChange, onRemove };
        })}
      />
    </Card>
  );
};
