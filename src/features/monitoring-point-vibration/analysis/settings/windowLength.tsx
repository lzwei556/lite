import React from 'react';
import { Button, Form, Popover, Space } from 'antd';
import { ColumnWidthOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Flex, IconButton, SelectFormItem, TextFormItem } from '../../../../components';

export const WindowLength = {
  128: { value: 128 },
  256: { value: 256 },
  512: { value: 512 },
  1024: { value: 1024 },
  2048: { value: 2048 },
  4096: { value: 4096 },
  8192: { value: 8192 }
} as const;

export const windowLengths = Object.values(WindowLength).map((len) => len.value);
export const windowLength = {
  label: 'chart.window.length',
  name: 'window_length',
  options: windowLengths.map((n) => ({
    label: `chart.window.length.${n}`,
    value: n
  }))
};

export function useWindowLength(maxLen?: number) {
  const [window_length, setWindowLength] = React.useState<number>(getDefault(maxLen));
  return { window_length, setWindowLength };
}

const getDefault = (maxLen?: number) => {
  let len: number = WindowLength[4096].value;
  if (maxLen && maxLen < len) {
    len = Math.max(...windowLengths.filter((len) => len <= maxLen));
  }
  return len;
};

export const WindowLengthPopup = ({
  maxLen,
  onOk
}: {
  maxLen?: number;
  onOk: (windowLength: number) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm<{ window_length: number }>();
  const { label, name, options } = windowLength;
  return (
    <Popover
      content={
        <Form
          form={form}
          layout='vertical'
          initialValues={{ window_length: getDefault(maxLen) }}
          style={{ width: 220, padding: 12 }}
        >
          <SelectFormItem
            label={label}
            name={name}
            selectProps={{
              options: options.map((len) => ({
                ...len,
                label: intl.get(len.label)
              }))
            }}
          />
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
                      onOk(values.window_length);
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
      <IconButton
        color='primary'
        icon={<ColumnWidthOutlined />}
        onClick={() => setOpen(true)}
        size='small'
        tooltipProps={{ title: intl.get('analysis.vibration.window.length') }}
        variant='outlined'
      />
    </Popover>
  );
};
