import React from 'react';
import { Button, Form, Popover, Space, Tooltip } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Flex, NumberFormItem, TextFormItem } from '../../../../components';

type RangeProps = { f_h: number; f_l: number };

const Range = { label: 'zoom.frequency.range', range: [{ name: 'f_l' }, { name: 'f_h' }] };

export function useZoomRange() {
  const [zoomRange, setZoomRange] = React.useState<RangeProps>({ f_h: 2000, f_l: 1000 });
  return { zoomRange, setZoomRange };
}

export const ZoomRange = ({ onOk }: { onOk: (values: RangeProps) => void }) => {
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm<RangeProps>();
  const { label, range } = Range;
  return (
    <Popover
      content={
        <Form
          form={form}
          layout='vertical'
          initialValues={{ f_h: 2000, f_l: 1000 }}
          style={{ width: 220, padding: 12 }}
        >
          <TextFormItem label={label}>
            <Space>
              <NumberFormItem {...range[0]} noStyle />
              -
              <NumberFormItem {...range[1]} noStyle />
            </Space>
          </TextFormItem>
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
      <Tooltip title={intl.get('analysis.vibration.zoom.range')}>
        <Button
          color='primary'
          icon={<ZoomInOutlined />}
          onClick={() => setOpen(true)}
          variant='outlined'
          size='small'
        />
      </Tooltip>
    </Popover>
  );
};
