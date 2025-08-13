import React from 'react';
import { Button, Divider, Input, List, Popover, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { ChartMark, DeleteIconButton, EditIconButton, useChartContext } from '../../../components';
import { useLocaleContext } from '../../../localeProvider';
import { DisplayProperty } from '../../../constants/properties';

export const MarkList = ({ property }: { property: DisplayProperty }) => {
  const ref = useChartContext();
  const { cursor, visibledMarks, dispatchMarks } = ChartMark.useContext();
  let propertyTitle = `${intl.get(property.name)} (${property.unit})`;
  if (cursor === 'line') {
    propertyTitle = `${intl.get('FIELD_CORROSION_RATE')} (mm/a)`;
  }
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
            {intl.get('INDEX_NUMBER')}
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
  const { language } = useLocaleContext();
  const renderDescription = () => {
    const descriptions = description?.split(',') ?? [];
    const start = language === 'en-US' ? 'Start ' : '开始';
    const end = language === 'en-US' ? 'End ' : '结束';
    return (
      <Space direction='vertical' size={0}>
        {descriptions.length <= 1
          ? descriptions
          : descriptions.map((d, i) => (
              <Space key={i}>
                {i === 0 ? start : end} <span style={{ fontSize: 13 }}>{d}</span>
              </Space>
            ))}
      </Space>
    );
  };
  return (
    <List.Item
      actions={[
        <DeleteIconButton confirmProps={{}} buttonProps={{ onClick: onRemove, color: 'default' }} />
      ]}
    >
      <List.Item.Meta
        title={
          <Space split={<Divider type='vertical' />}>
            <span>
              <Typography.Text type='secondary'>{label}</Typography.Text>
              <Pop key={name} val={label} onBlur={(e) => onChange(e.target.value)} />
            </span>
            {value === '0' ? intl.get('no.corrosion') : value}
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
