import * as React from 'react';
import { Form, ModalProps } from 'antd';
import { Translation } from 'locales/utils';
import { RangeDatePicker, SelectFormItem, TextFormItem, useRange } from '../components';
import { Dayjs, downloadFile } from '../utils';
import { getFilename } from '../utils/format';
import { ModalWrapper } from '../components/modalWrapper';
import { downloadHistory, MonitoringPointRow } from '../asset-common';
import { MonitoringPointType } from 'common';
import { useI18n } from 'providers/i18n';

export interface DownloadModalProps extends ModalProps {
  measurement: MonitoringPointRow;
  onSuccess: () => void;
  assetId?: number;
  virtualPoint?: MonitoringPointRow | undefined;
  range?: Dayjs.RangeValue;
}

export const DownloadData: React.FC<DownloadModalProps> = (props) => {
  const { measurement, onSuccess, assetId } = props;
  const { numberedRange, setRange } = useRange(props.range);
  const [form] = Form.useForm();
  const { language } = useI18n();

  const properties = MonitoringPointType.Key.getProperties(
    measurement.type,
    measurement.properties
  );
  const onDownload = () => {
    form.validateFields().then((values) => {
      if (numberedRange) {
        const [from, to] = numberedRange;
        downloadHistory(
          measurement.id,
          from,
          to,
          JSON.stringify(values.properties),
          language,
          assetId
        ).then((res) => {
          downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
          onSuccess();
        });
      }
    });
  };

  return (
    <ModalWrapper
      {...props}
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
        <TextFormItem label='label.data.range'>
          <RangeDatePicker
            onChange={setRange}
            style={{ width: '100%' }}
            defaultValue={props.range}
          />
        </TextFormItem>
      </Form>
    </ModalWrapper>
  );
};
