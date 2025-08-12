import React from 'react';
import { Form, ModalProps } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { Device } from '../../../types/device';
import { RangeDatePicker, SelectFormItem, TextFormItem } from '../../../components';
import { useLocaleContext } from '../../../localeProvider';
import { ModalWrapper } from '../../../components/modalWrapper';
import { getDisplayProperties } from '../util';
import { DeviceType } from '../../../types/device_type';
import { DisplayProperty } from '../../../constants/properties';
import { DownloadDeviceDataRequest } from '../../../apis/device';
import { useContext } from '..';

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
  const { range, numberedRange, onChange } = useContext();
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
      width={400}
      title={intl.get('DWONLOAD_DATA')}
      okText={intl.get('DOWNLOAD')}
      onOk={onDownload}
    >
      <Form form={form} layout='vertical'>
        <SelectFormItem
          label='properties'
          name='properties'
          rules={[{ required: true }]}
          selectProps={{
            mode: 'multiple',
            maxTagCount: 2,
            options: properties.map(({ key, name }) => ({ label: intl.get(name), value: key }))
          }}
        />
        {channels.length > 0 && (
          <SelectFormItem
            label='CURRENT_CHANNEL'
            name='channel'
            initialValue={1}
            selectProps={{ options: channels }}
          />
        )}
        <TextFormItem label='DATE_RANGE'>
          <RangeDatePicker onChange={onChange} value={range} style={{ width: '100%' }} />
        </TextFormItem>
      </Form>
    </ModalWrapper>
  );
};

export default DownloadModal;
