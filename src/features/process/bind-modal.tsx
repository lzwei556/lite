import { Form, FormInstance, SelectProps } from 'antd';
import React from 'react';
import { useFormBindingsProps, useFormItemBindingsProps, useModalBindingsProps } from '../../hooks';
import { ModalFormProps } from '../../types/common';
import intl from 'react-intl-universal';
import { ProcessDTO, ProcessFormDataDTO, transform, useBindProcess } from './use-services';
import { ModalWrapper } from '../../components/modalWrapper';
import { ParameterFormItem, ProcessType } from '../../process-type';
import { SelectFormItem } from '../../components';
import { MonitoringPointRow } from '../../monitoring-point';
import { Device } from '../../types/device';
import { Option } from '../../common';
import { CommonProps, sourceId, type } from './common';

type Props = ModalFormProps & CommonProps;

export const BindModal = (props: Props) => {
  const formProps = useFormProps(props.process);
  const modalProps = useModalProps({ form: formProps.form, ...props });
  const { typesSelectFromItemProps, sourceIdSelectFromItemProps, parametersFormItemProps } =
    useSelectedType(props);
  return (
    <ModalWrapper {...modalProps}>
      <Form {...formProps}>
        <SelectFormItem {...typesSelectFromItemProps} />
        <SelectFormItem {...sourceIdSelectFromItemProps} />
        {parametersFormItemProps.map((item, i) => (
          <ParameterFormItem {...item} key={i} />
        ))}
      </Form>
    </ModalWrapper>
  );
};

const useFormProps = (process?: ProcessDTO) => {
  const [form] = Form.useForm();
  return useFormBindingsProps({
    form,
    layout: 'vertical',
    initialValues: process ? transform(process) : undefined
  });
};

const useModalProps = ({
  form,
  id,
  onSuccess,
  ...rest
}: Props & { form: FormInstance<ProcessFormDataDTO> }) => {
  const { runAsync, loading } = useBindProcess();
  return useModalBindingsProps({
    ...rest,
    afterClose: () => form.resetFields(),
    okText: intl.get('SAVE'),
    okButtonProps: { loading },
    onOk: () => {
      form.validateFields().then((values) => {
        runAsync(id, values).then(onSuccess);
      });
    },
    title: intl.get('bind.process')
  });
};

const useSelectedType = (params: Props) => {
  const [type, setType] = React.useState<number | undefined>(params.process?.type);
  const disabled = !!params.process;
  return {
    typesSelectFromItemProps: useTypesSelectFormItemProps(disabled, setType),
    sourceIdSelectFromItemProps: useSourceIdSelectFormItemProps({ ...params, disabled, type }),
    parametersFormItemProps: useParametersFormItemsProps({ type, ...params })
  };
};

const useTypesSelectFormItemProps = (disabled: boolean, onChange: (type: number) => void) => {
  return {
    ...useFormItemBindingsProps({ ...type, rules: [{ required: true }] }),
    selectProps: {
      options: ProcessType.getOptions().map((opt) => ({ ...opt, label: intl.get(opt.label) })),
      disabled,
      onChange
    } as SelectProps
  };
};

const useSourceIdSelectFormItemProps = ({
  type,
  disabled,
  monitoringPoints
}: {
  type?: number;
  disabled: boolean;
  monitoringPoints: MonitoringPointRow[];
}) => {
  return {
    ...useFormItemBindingsProps({ ...sourceId, rules: [{ required: true }] }),
    selectProps: {
      options: monitoringPoints
        .filter((m) => (type ? ProcessType.Key.getSourceType(type) === m.type : () => true))
        .map((m) => ({ label: m.name, value: m.id })),
      disabled: disabled || !type
    } as SelectProps
  };
};

const useParametersFormItemsProps = ({
  type,
  devices = []
}: {
  type?: number;
  devices?: Device[];
}) => {
  if (!type) {
    return [];
  }
  return ProcessType.Key.getParameters(type).map((settings) => {
    const { options: opts, ...rest } = settings;
    let options: Option[] | undefined;
    const deviceType = ProcessType.Key.getDeviceType(type);
    if (opts && deviceType) {
      options = devices
        .filter((d) => d.typeId === deviceType)
        .map((d) => ({ label: d.name, value: d.id }));
    }
    return { ...rest, options };
  });
};
