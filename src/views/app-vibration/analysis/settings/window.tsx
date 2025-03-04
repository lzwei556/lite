import React from 'react';
import { Button, Form, Popover, Select, Space } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Flex } from '../../../../components';

const WindowSettings = {
  label: 'chart.window',
  name: 'window',
  options: [
    { label: 'chart.window.none', value: 'none' },
    { label: 'chart.window.rectangle', value: 'rectangle' },
    { label: 'chart.window.hamming', value: 'hamming' },
    { label: 'chart.window.hanning', value: 'hanning' },
    { label: 'chart.window.triangular', value: 'triangular' },
    { label: 'chart.window.blackman', value: 'blackman' },
    { label: 'chart.window.kaiser', value: 'kaiser' },
    { label: 'chart.window.chebwin', value: 'chebwin' },
    { label: 'chart.window.bartlett', value: 'bartlett' },
    { label: 'chart.window.flattop', value: 'flattop' }
  ]
};

export function useWindow() {
  const [window, setWindow] = React.useState<string>(WindowSettings.options[0].value);
  return { window, setWindow };
}

export const Window = ({ onOk }: { onOk: (window: string) => void }) => {
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm<{ window: string }>();
  const { label, name, options } = WindowSettings;
  return (
    <Popover
      content={
        <Form
          form={form}
          layout='vertical'
          initialValues={{ window: options[0].value }}
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
                      onOk(values.window);
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
        icon={<PlusSquareOutlined />}
        onClick={() => setOpen(true)}
        variant='filled'
      />
    </Popover>
  );
};
