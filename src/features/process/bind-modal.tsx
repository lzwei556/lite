import { Form, FormInstance, SelectProps } from 'antd';
import React from 'react';
import { useFormBindingsProps, useFormItemBindingsProps, useModalBindingsProps } from '../../hooks';
import { ModalFormProps } from '../../types/common';
import intl from 'react-intl-universal';
import { ProcessFormDataDTO, transform, useBindProcess } from './use-services';
import { ModalWrapper } from '../../components/modalWrapper';
import { ParameterFormItem, ProcessType } from '../../process-type';
import { SelectFormItem, TextFormItem } from '../../components';
import { CommonProps, sourceIdField, typeField } from './common';
import { Option } from 'common/types';
import * as MonitoringPoint from 'domains/monitoring-point';

type Props = ModalFormProps & CommonProps;

export const BindModal = (props: Props) => {
  const formProps = useFormProps(props);
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
        <TextFormItem
          {...useFormItemBindingsProps({ name: 'monitoring_point_id', hidden: true })}
        />
      </Form>
    </ModalWrapper>
  );
};

const useFormProps = (params: Props) => {
  const [form] = Form.useForm();
  return useFormBindingsProps({
    form,
    layout: 'vertical',
    initialValues: useInitialValues(params)
  });
};

const useInitialValues = ({
  process,
  initialProcess,
  monitoringPoint
}: Props): Partial<ProcessFormDataDTO> | undefined => {
  if (process) {
    return { ...transform(process), monitoring_point_id: monitoringPoint.id };
  } else if (initialProcess) {
    return {
      type: initialProcess.type,
      parameters: { targetDeviceId: initialProcess.oilFillerId },
      monitoring_point_id: monitoringPoint.id
    };
  }
};

const useModalProps = ({
  form,
  monitoringPoint,
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
        runAsync(monitoringPoint.assetId, values).then(onSuccess);
      });
    },
    title: intl.get('bind.process')
  });
};

const useSelectedType = (params: Props) => {
  const [type, setType] = React.useState<number | undefined>(
    params.process?.type || params.initialProcess?.type
  );
  const disabled = !!params.process;
  const hidden = !!params.initialProcess?.type;
  return {
    typesSelectFromItemProps: useTypesSelectFormItemProps(disabled, setType, type, hidden),
    sourceIdSelectFromItemProps: useSourceIdSelectFormItemProps({ ...params, disabled, type }),
    parametersFormItemProps: useParametersFormItemsProps({ type, ...params })
  };
};

const useTypesSelectFormItemProps = (
  disabled: boolean,
  onChange: (type: number) => void,
  type?: number,
  hidden?: boolean
) => {
  return {
    ...useFormItemBindingsProps({ ...typeField, rules: [{ required: true }], hidden }),
    selectProps: {
      defaultValue: type,
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
  monitoringPoints: MonitoringPoint.Types.Entity[];
}) => {
  return {
    ...useFormItemBindingsProps({ ...sourceIdField, rules: [{ required: true }] }),
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
  devices = [],
  initialProcess
}: {
  type?: number;
} & Props) => {
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
    return { ...rest, options, disabled: !!initialProcess?.oilFillerId };
  });
};
