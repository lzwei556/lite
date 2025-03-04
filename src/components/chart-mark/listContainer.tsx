import React from 'react';
import { Col, ColProps } from 'antd';
import { Card, CardProps } from '../card';
import { useChartContext } from '../charts';
import { List } from './components/list';
import { useContext } from './context';
import { brushAreas } from './utils';

export const ListContainer = ({
  colProps = { span: 24 },
  cardProps
}: {
  colProps?: ColProps;
  cardProps?: CardProps;
}) => {
  const ref = useChartContext();
  const { visibledMarks, dispatchMarks } = useContext();
  return (
    <Col {...colProps}>
      <Card {...cardProps} title='标注' styles={{ body: { overflowY: 'auto', maxHeight: 250 } }}>
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
    </Col>
  );
};
