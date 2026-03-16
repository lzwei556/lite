import React from 'react';
import { Form, ModalProps } from 'antd';
import { Translation } from 'locales/utils';
import { ModalFormProps } from '../../../types/common';
import { Device } from '../../../types/device';
import { RangeDatePicker, SelectFormItem, TextFormItem } from '../../../components';
import { ModalWrapper } from '../../../components/modalWrapper';
import { getDisplayProperties } from '../util';
import { DeviceType } from '../../../types/device_type';
import { DownloadDeviceDataRequest } from '../../../apis/device';
import { useContext } from '..';
import { CharacteristicData } from 'common';
import { downloadFile } from 'utils';
import { useI18n } from 'providers/i18n';

export interface DownloadModalProps extends ModalProps {
  device: Device;
  property?: any;
  properties: CharacteristicData.DisplayProperty[];
  onSuccess: () => void;
  channel?: string;
}

export const DownloadModal = (props: ModalFormProps & { device: Device }) => {
  const { device, onSuccess, ...rest } = props;
  const properties = getDisplayProperties(device.properties, device.typeId);
  const channels = DeviceType.getChannels(device.typeId);
  const { range, numberedRange, onChange } = useContext();
  const [form] = Form.useForm();
  const { language } = useI18n();

  const onDownload = () => {
    form.validateFields(['properties']).then((values) => {
      const pids = JSON.stringify(values.properties);
      const filter = values.channel ? { pids, channel: values.channel } : { pids };
      if (numberedRange) {
        const [from, to] = numberedRange;
        DownloadDeviceDataRequest(device.id, from, to, filter, language).then((res) => {
          if (res.status === 200) {
            downloadFile(window.URL.createObjectURL(new Blob([res.data])), `${device.name}.xlsx`);
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
      title={Translation.get('feature.download')}
      okText={Translation.get('common.action.download')}
      onOk={onDownload}
    >
      <Form form={form} layout='vertical'>
        <SelectFormItem
          label='feature.properties'
          name='properties'
          rules={[{ required: true }]}
          selectProps={{
            mode: 'multiple',
            maxTagCount: 2,
            options: properties.map(({ key, name }) => ({
              label: Translation.get(name),
              value: key
            }))
          }}
        />
        {channels.length > 0 && (
          <SelectFormItem
            label='device.channel.current'
            name='channel'
            initialValue={1}
            selectProps={{ options: channels }}
          />
        )}
        <TextFormItem label='label.data.range'>
          <RangeDatePicker onChange={onChange} value={range} style={{ width: '100%' }} />
        </TextFormItem>
      </Form>
    </ModalWrapper>
  );
};

export default DownloadModal;
