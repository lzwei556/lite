import React from 'react';
import { Button, Form, Popover, Space } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { Flex, IconButton, SelectFormItem, TextFormItem } from 'components';

const WindowSettings = {
  label: 'vibration.analysis.window',
  name: 'window',
  options: [
    { label: 'common.none', value: 'none' },
    { label: 'vibration.analysis.window.rectangle', value: 'rectangle' },
    { label: 'vibration.analysis.window.hamming', value: 'hamming' },
    { label: 'vibration.analysis.window.hanning', value: 'hanning' },
    { label: 'vibration.analysis.window.triangular', value: 'triangular' },
    { label: 'vibration.analysis.window.blackman', value: 'blackman' },
    { label: 'vibration.analysis.window.kaiser', value: 'kaiser' },
    { label: 'vibration.analysis.window.chebwin', value: 'chebwin' },
    { label: 'vibration.analysis.window.bartlett', value: 'bartlett' },
    { label: 'vibration.analysis.window.flattop', value: 'flattop' }
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
          <SelectFormItem
            label={label}
            name={name}
            selectProps={{
              options: options.map((len) => ({
                ...len,
                label: Translation.get(len.label)
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
                  {Translation.get('common.action.cancel')}
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
                  {Translation.get('common.ok')}
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
        icon={<PlusSquareOutlined />}
        onClick={() => setOpen(true)}
        size='small'
        tooltipProps={{ title: Translation.get('vibration.analysis.window') }}
        variant='outlined'
      />
    </Popover>
  );
};
