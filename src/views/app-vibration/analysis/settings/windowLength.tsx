import React from 'react';
import { Button, Form, Popover, Select, Space } from 'antd';
import { ColumnWidthOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Flex } from '../../../../components';

export const windowLengths = [128, 256, 512, 1024, 2048, 4096, 8192];
export const windowLength = {
  label: 'chart.window.length',
  name: 'window_length',
  options: windowLengths.map((n) => ({
    label: `chart.window.length.${n}`,
    value: n
  }))
};

export function useWindowLength() {
  const [window_length, setWindowLength] = React.useState<number>(windowLengths[0]);
  return { window_length, setWindowLength };
}

export const WindowLength = ({ onOk }: { onOk: (windowLength: number) => void }) => {
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm<{ window_length: number }>();
  const { label, name, options } = windowLength;
  return (
    <Popover
      content={
        <Form
          form={form}
          layout='vertical'
          initialValues={{ window_length: windowLengths[0] }}
          style={{ width: 220, padding: 12 }}
        >
          <Form.Item {...{ name, label: intl.get(label) }}>
            <Select
              options={options.map((len) => ({
                ...len,
                label: intl.get(len.label)
              }))}
            />
          </Form.Item>
          <Form.Item noStyle>
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
          </Form.Item>
        </Form>
      }
      open={open}
      onOpenChange={setOpen}
      placement='leftTop'
      trigger='click'
    >
      <Button
        color='primary'
        icon={<ColumnWidthOutlined />}
        onClick={() => setOpen(true)}
        variant='filled'
      />
    </Popover>
  );
};
