import React from 'react';
import { Form, ModalProps, Select } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { Device } from '../../../types/device';
import { useRange, RangeDatePicker } from '../../../components';
import { useLocaleContext } from '../../../localeProvider';
import { ModalWrapper } from '../../../components/modalWrapper';
import { getDisplayProperties } from '../util';
import { DeviceType } from '../../../types/device_type';
import { DisplayProperty } from '../../../constants/properties';
import { DownloadDeviceDataRequest } from '../../../apis/device';

const { Option } = Select;

export interface DownloadModalProps extends ModalProps {
  device: Device;
  property?: any;
  properties: DisplayProperty[];
  onSuccess: () => void;
  channel?: string;
}

export const DownloadModal = (props: ModalFormProps & { device: Device }) => {
  const { device, onSuccess, ...rest } = props;
  const properties = getDisplayProperties(device.properties, device.typeId);
  const channels = DeviceType.getChannels(device.typeId);
  const { numberedRange, setRange } = useRange();
  const [form] = Form.useForm();
  const { language } = useLocaleContext();

  const onDownload = () => {
    form.validateFields(['properties']).then((values) => {
      const pids = JSON.stringify(values.properties);
      const filter = values.channel ? { pids, channel: values.channel } : { pids };
      if (numberedRange) {
        const [from, to] = numberedRange;
        DownloadDeviceDataRequest(
          device.id,
          from,
          to,
          filter,
          language === 'en-US' ? 'en' : 'zh'
        ).then((res) => {
          if (res.status === 200) {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${device.name}.xlsx`);
            document.body.appendChild(link);
            link.click();
            onSuccess();
          }
        });
      }
    });
  };

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      width={430}
      title={intl.get('DWONLOAD_DATA')}
      okText={intl.get('DOWNLOAD')}
      onOk={onDownload}
    >
      <Form form={form} labelCol={{ span: 8 }}>
        <Form.Item label={intl.get('PROPERTY')} name={'properties'} required>
          <Select
            placeholder={intl.get('PLEASE_SELECT_DEVICE_PROPERTY')}
            mode={'multiple'}
            maxTagCount={2}
          >
            {properties.map((item) => (
              <Option key={item.key} value={item.key}>
                {intl.get(item.name)}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {channels.length > 0 && (
          <Form.Item label={intl.get('CURRENT_CHANNEL')} name='channel'>
            <Select defaultValue={1}>
              {channels.map(({ label, value }) => (
                <Select.Option value={value} key={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item label={intl.get('DATE_RANGE')} required>
          <RangeDatePicker onChange={setRange} />
        </Form.Item>
      </Form>
    </ModalWrapper>
  );
};

export default DownloadModal;
