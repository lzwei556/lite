import React from 'react';
import { Button, Form, Popover, Space, Tooltip } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Flex, NumberFormItem, SelectFormItem, TextFormItem } from '../../../../components';
import {
  CutoffRange,
  FilterTypeRelatedFields,
  filterTypeRelatedFieldsDefault,
  Item,
  RangeItem,
  useFilterTypeRelatedItems
} from './useFilterType';

export function useFilterTypeRelated() {
  const [filter_type_related, setFilter_type_related] = React.useState<FilterTypeRelatedFields>(
    filterTypeRelatedFieldsDefault
  );
  return { filter_type_related, setFilter_type_related };
}

export const FilterTypeRelated = ({
  onOk,
  initial
}: {
  onOk: (values: FilterTypeRelatedFields) => void;
  initial: CutoffRange;
}) => {
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm<FilterTypeRelatedFields>();
  const items = useFilterTypeRelatedItems((range) => {
    form.setFieldsValue({ cutoff_range_low: range[0], cutoff_range_high: range[1] });
  }, initial);

  return (
    <Popover
      content={
        <Form
          form={form}
          layout='vertical'
          initialValues={filterTypeRelatedFieldsDefault}
          style={{ width: 220, padding: 12 }}
        >
          {items.map((item, i) => {
            if (item.hasOwnProperty('range')) {
              const [first, last] = (item as RangeItem).range;
              return (
                <TextFormItem key={i} label={item.label}>
                  <Space>
                    <NumberFormItem {...first} noStyle />
                    -
                    <NumberFormItem {...last} noStyle />
                  </Space>
                </TextFormItem>
              );
            } else {
              const { label, options, ...rest } = item as Item;
              return options ? (
                <SelectFormItem
                  {...rest}
                  key={i}
                  label={label}
                  selectProps={{
                    ...item,
                    options: options.map((o) => ({ ...o, label: intl.get(o.label) }))
                  }}
                />
              ) : (
                <NumberFormItem {...rest} label={label} key={i} />
              );
            }
          })}
          <TextFormItem noStyle>
            <Flex>
              <Space>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {intl.get('CANCEL')}
                </Button>
                <Button
                  onClick={() => {
                    form.validateFields().then((values) => {
                      onOk(values);
                      setOpen(false);
                    });
                  }}
                  type='primary'
                >
                  {intl.get('OK')}
                </Button>
              </Space>
            </Flex>
          </TextFormItem>
        </Form>
      }
      open={open}
      onOpenChange={setOpen}
      placement='leftTop'
      trigger='click'
    >
      <Tooltip title={intl.get('analysis.vibration.filter')}>
        <Button
          color='primary'
          icon={<FilterOutlined />}
          onClick={() => setOpen(true)}
          variant='outlined'
          size='small'
        />
      </Tooltip>
    </Popover>
  );
};
