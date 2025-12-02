import * as React from 'react';
import { Form, FormInstance, SelectProps } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from 'components/modalWrapper';
import { RangeDatePicker, SelectFormItem, TextFormItem } from 'components';
import { ModalFormProps } from 'types/common';
import { useFormBindingsProps, useFormItemBindingsProps, useModalBindingsProps } from 'hooks';
import { useLocaleContext } from 'localeProvider';
import { Dayjs, downloadFile, getFilename } from 'utils';
import {
  DownloadFormData,
  transform2DownloadPostData,
  URLPathname,
  useDownloadSubmit
} from './use-services';
import { CharacteristicData } from 'common';

type Props = ModalFormProps & {
  id: number;
  properties: CharacteristicData.DisplayProperty[];
  urlPathname: URLPathname;
} & {
  range?: Dayjs.RangeValue;
};

export const DownloadModal = ({ id, properties, range, ...rest }: Props) => {
  const { formProps, propertiesSelectFromItemProps, dateRangePickerFormItemProps } = useFormProps(
    properties,
    range
  );
  const modalProps = useModalProps({ form: formProps.form, id, ...rest });

  return (
    <ModalWrapper {...modalProps}>
      <Form {...formProps}>
        <SelectFormItem {...propertiesSelectFromItemProps} />
        <TextFormItem {...dateRangePickerFormItemProps}>
          <RangeDatePicker style={{ width: '100%' }} />
        </TextFormItem>
      </Form>
    </ModalWrapper>
  );
};

const useFormProps = (
  properties: CharacteristicData.DisplayProperty[],
  range?: Dayjs.RangeValue
) => {
  const [form] = Form.useForm<DownloadFormData>();
  return {
    formProps: useFormBindingsProps({ form, layout: 'vertical', initialValues: { range } }),
    propertiesSelectFromItemProps: usePropertiesSelectProps(properties),
    dateRangePickerFormItemProps: useFormItemBindingsProps({
      label: 'DATE_RANGE',
      name: 'range',
      rules: [{ required: true }]
    })
  };
};

const usePropertiesSelectProps = (properties: CharacteristicData.DisplayProperty[]) => {
  return {
    ...useFormItemBindingsProps({
      label: 'properties',
      name: 'properties',
      rules: [{ required: true }]
    }),
    selectProps: {
      mode: 'multiple',
      maxTagCount: 2,
      options: properties.map(({ key, name }) => ({
        label: intl.get(name),
        value: key
      }))
    } as SelectProps
  };
};

const useModalProps = ({
  form,
  id,
  urlPathname,
  ...rest
}: Omit<Props, 'properties'> & {
  form: FormInstance<DownloadFormData>;
}) => {
  const { language } = useLocaleContext();
  const { runAsync: handleSubmit, loading } = useDownloadSubmit();
  return useModalBindingsProps({
    ...rest,
    afterClose: () => form.resetFields(),
    okText: intl.get('DOWNLOAD'),
    okButtonProps: { loading },
    onOk: () => {
      form.validateFields().then((values) => {
        handleSubmit(id, urlPathname, transform2DownloadPostData(values, language)).then((res) => {
          downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
          rest.onSuccess();
        });
      });
    },
    title: intl.get('DWONLOAD_DATA'),
    width: 400
  });
};
