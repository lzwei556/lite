import React from 'react';
import { Button, Divider, Input, List as AntList, Popover, Space, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Mark } from '../types';

export const List = ({
  items
}: {
  items: (Mark & {
    onChange: (value: string) => void;
    onRemove: () => void;
  })[];
}) => {
  return (
    <AntList
      dataSource={items}
      renderItem={(item, i) => {
        return <ListItem {...item} />;
      }}
    />
  );
};

function ListItem({
  description,
  onRemove,
  onChange,
  label,
  name,
  value
}: Mark & {
  onRemove: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <AntList.Item actions={[<Button size='small' icon={<DeleteOutlined />} onClick={onRemove} />]}>
      <AntList.Item.Meta
        title={
          <Space split={<Divider type='vertical' />}>
            <span>
              <Typography.Text type='secondary'>{label}</Typography.Text>
              <Pop key={name} val={label} onBlur={(e) => onChange(e.target.value)} />
            </span>
            {value}
          </Space>
        }
        description={
          <Space direction='vertical' size={0}>
            {description?.split(',')}
          </Space>
        }
      />
    </AntList.Item>
  );
}

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
      <Button icon={<EditOutlined />} size='small' type='link' />
    </Popover>
  );
}
