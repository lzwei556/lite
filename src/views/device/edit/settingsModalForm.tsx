import React from 'react';
import { Button, Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { ModalWrapper } from '../../../components/modalWrapper';
import {
  useButtonBindingsProps,
  useFormBindingsProps,
  useModalBindingsProps
} from '../../../hooks';
import { generateColProps } from '../../../utils/grid';
import * as Basis from '../basis-form-items';
import {
  DeviceSetting,
  FormCommonProps,
  FormItemsProps,
  SettingsFormItems
} from '../settings-common';
import { CanCopySettings } from './can-copying-settings';
import { useUpdateSettings } from './hooks';

type Props = ModalFormProps & FormCommonProps;

export const SettingsModalForm = (props: Props) => {
  return (
    <Basis.ContextProvier device={props.device}>
      <ModalForm {...props} />
    </Basis.ContextProvier>
  );
};

const ModalForm = (props: Props) => {
  const { modalProps, formProps, settingsFormItemsProps } = useProps(props);

  return (
    <ModalWrapper {...modalProps}>
      <Form {...formProps}>{<SettingsFormItems {...settingsFormItemsProps} />}</Form>
    </ModalWrapper>
  );
};

const useProps = (props: Props) => {
  const { settings } = Basis.useContext();
  const formProps = useFormBindingsProps({ layout: 'vertical' });
  return {
    modalProps: useModalProps(props, <Footer {...{ ...props, form: formProps.form }} />),
    formProps,
    settingsFormItemsProps: {
      deviceType: props.device.typeId,
      formItemColProps: verticalFewSettings(settings, generateColProps({ xl: 12, xxl: 12 })),
      groupCardProps: { style: { marginBlock: 16 } },
      ignoreGroup: true,
      settings
    }
  };
};

const useModalProps = (props: Props, footer: React.ReactNode) => {
  const { form, ...rest } = props;
  return useModalBindingsProps({
    ...rest,
    afterClose: () => form?.resetFields(),
    footer,
    title: intl.get('EDIT_SOMETHING', { something: intl.get('DEVICE_SETTINGS') }),
    width: 640
  });
};

const Footer = (props: Props) => {
  const { device, form } = props;
  const [cancelButtonProps, children, okButtonProps] = useFooter(props);
  return [
    <Button key='cancel' {...cancelButtonProps} />,
    <CanCopySettings {...{ ...children, device, form }} />,
    <Button key='ok' {...okButtonProps} />
  ];
};

const useFooter = (props: Props) => {
  return [
    useButtonBindingsProps({ children: intl.get('CANCEL'), onClick: props.onCancel }),
    useButtonBindingsProps({ children: intl.get('apply.settings.to.the.same.types') }),
    useOKButtonProps(props)
  ];
};

const useOKButtonProps = ({ device, onSuccess, form }: Props) => {
  const { loading, handleSubmit } = useUpdateSettings(device.id, onSuccess);
  return useButtonBindingsProps({
    children: intl.get('SAVE'),
    loading,
    onClick: () => form?.validateFields().then(handleSubmit),
    type: 'primary'
  });
};

const verticalFewSettings = (
  settings: DeviceSetting[],
  formItemColProps: FormItemsProps['formItemColProps']
) => {
  return settings.length <= 4 ? generateColProps({}) : formItemColProps;
};
