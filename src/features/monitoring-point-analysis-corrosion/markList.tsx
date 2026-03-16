import React from 'react';
import { Divider, Input, List, Popover, Space, Typography } from 'antd';
import { Translation } from 'locales/utils';
import {
  ChartMark,
  DeleteIconButtonWithoutConfirm,
  EditIconButton,
  useChartContext
} from '../../components';
import { CharacteristicData } from 'common';
import { MarkType } from '.';

export const MarkList = ({
  property,
  markType
}: {
  property: CharacteristicData.DisplayProperty;
  markType: MarkType;
}) => {
  const ref = useChartContext();
  const { marks, dispatchMarks } = ChartMark.useContext();
  let propertyTitle = `${Translation.get(property.name)} (${property.unit})`;
  if (markType === 'area') {
    propertyTitle = `${Translation.get('FIELD_CORROSION_RATE')} (mm/a)`;
  }
  const visibledMarks = marks.filter((mark) => mark.type === markType);
  return (
    <List
      style={{ overflowY: 'auto', maxHeight: 500 }}
      dataSource={visibledMarks.map((mark) => {
        const onChange = (input: string) => {
          if (input.length > 0) {
            dispatchMarks({ type: 'change_label', mark: { ...mark, label: input } });
          }
        };
        const onRemove = () => {
          dispatchMarks({ type: 'remove', mark });
          ChartMark.brushAreas(
            visibledMarks.filter((m) => m.name !== mark.name),
            ref.current.getInstance()
          );
        };
        return { ...mark, onChange, onRemove };
      })}
      header={
        visibledMarks.length > 0 && (
          <Space split={<Divider type='vertical' />} size={8}>
            {Translation.get('common.index')}
            {propertyTitle}
          </Space>
        )
      }
      renderItem={(item) => {
        return <Item {...item} />;
      }}
    />
  );
};

const Item = ({
  description,
  onRemove,
  onChange,
  label,
  name,
  value
}: ChartMark.Mark & {
  onRemove: () => void;
  onChange: (value: string) => void;
}) => {
  const renderDescription = () => {
    const descriptions = description?.split(',') ?? [];
    const start = Translation.get('common.begin');
    const end = Translation.get('common.end');
    return (
      <Space direction='vertical' size={0}>
        {descriptions.length <= 1
          ? descriptions
          : descriptions.map((d, i) => (
              <Space key={i}>
                <span style={{ display: 'inline-block', width: 40 }}>{i === 0 ? start : end}</span>
                <span style={{ fontSize: 13 }}>{d}</span>
              </Space>
            ))}
      </Space>
    );
  };
  return (
    <List.Item actions={[<DeleteIconButtonWithoutConfirm color='default' onClick={onRemove} />]}>
      <List.Item.Meta
        title={
          <Space split={<Divider type='vertical' />}>
            <span>
              <Typography.Text type='secondary'>{label}</Typography.Text>
              <Pop key={name} val={label} onBlur={(e) => onChange(e.target.value)} />
            </span>
            {value === '0' ? Translation.get('corrosion.analysis.no') : value}
          </Space>
        }
        description={renderDescription()}
      />
    </List.Item>
  );
};

function Pop({
  val,
  onBlur
}: {
  val?: string | number;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}) {
  const [value, setValue] = React.useState(val);
  return (
    <Popover
      content={
        <Input
          defaultValue={value ?? val}
          onBlur={onBlur}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      }
      onOpenChange={() => {
        if (!value) {
          setValue(val);
        }
      }}
      trigger={['click']}
    >
      <EditIconButton type='link' />
    </Popover>
  );
}
