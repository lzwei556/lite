import * as React from 'react';
import { Form, ModalProps } from 'antd';
import intl from 'react-intl-universal';
import { RangeDatePicker, SelectFormItem, TextFormItem, useRange } from '../components';
import { Dayjs } from '../utils';
import { getFilename } from '../utils/format';
import { useLocaleContext } from '../localeProvider';
import { ModalWrapper } from '../components/modalWrapper';
import { downloadHistory, MonitoringPointRow, Point } from '../asset-common';

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
  const { language } = useLocaleContext();

  const properties = Point.getPropertiesByType(measurement.type, measurement.properties);
  const onDownload = () => {
    form.validateFields().then((values) => {
      if (numberedRange) {
        const [from, to] = numberedRange;
        downloadHistory(
          measurement.id,
          from,
          to,
          JSON.stringify(values.properties),
          language === 'en-US' ? 'en' : 'zh',
          assetId
        ).then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', getFilename(res));
          document.body.appendChild(link);
          link.click();
          onSuccess();
        });
      }
    });
  };

  return (
    <ModalWrapper
      {...props}
      afterClose={() => form.resetFields()}
      width={430}
      title={intl.get('DWONLOAD_DATA')}
      okText={intl.get('DOWNLOAD')}
      onOk={onDownload}
    >
      <Form form={form} labelCol={{ span: 8 }}>
        <SelectFormItem
          label='PROPERTY'
          name='properties'
          rules={[{ required: true }]}
          selectProps={{
            mode: 'multiple',
            maxTagCount: 2,
            options: properties.map(({ key, name }) => ({ label: intl.get(name), value: key }))
          }}
        />
        <TextFormItem label='DATE_RANGE'>
          <RangeDatePicker onChange={setRange} />
        </TextFormItem>
      </Form>
    </ModalWrapper>
  );
};
