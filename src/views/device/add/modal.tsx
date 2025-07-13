import React from 'react';
import { Button, Form, Result } from 'antd';
import { ModalWrapper } from '../../../components/modalWrapper';
import { Card } from '../../../components';
import { ModalFormProps } from '../../../types/common';
import * as WSN from '../../../features/wsn';
import * as Basis from '../basis-form-items';
import { isBLEGateway, SettingsFormItems, useGroupCardProps } from '../settings-common';
import { AddFormProps, useCreate, useAddFormProps, useModalProps } from './hooks';

export const AddModal = (props: ModalFormProps) => {
  const addFormProps = useAddFormProps();
  const {
    formProps: { form }
  } = addFormProps;
  const {
    success,
    successProps: { result, continueButtonProps, closeButtonProps },
    handleSubmit
  } = useCreate(form!, props.onSuccess);
  const modalProps = useModalProps({ ...props, form: form!, success, handleSubmit });

  return (
    <ModalWrapper {...modalProps}>
      <Basis.ContextProvier form={form}>
        {success && (
          <Result
            {...result}
            extra={[
              <Button key='continue' {...continueButtonProps} />,
              <Button key='close' {...closeButtonProps} />
            ]}
          />
        )}
        {!success && <AddForm {...addFormProps} />}
      </Basis.ContextProvier>
    </ModalWrapper>
  );
};

const AddForm = (props: AddFormProps) => {
  const { formProps, basisCardProps, wsnCardProps, formItemColProps } = props;
  const { deviceType, settings } = Basis.useContext();
  const commonProps = { settings, formItemColProps, groupCardProps: useGroupCardProps({}) };
  return (
    <Form {...formProps}>
      <Card {...basisCardProps}>
        <Basis.FormItems formItemColProps={formItemColProps} />
      </Card>
      {deviceType && (
        <>
          {<SettingsFormItems {...commonProps} deviceType={deviceType} />}
          {isBLEGateway(deviceType) && (
            <Card {...wsnCardProps}>
              <WSN.FormItems formItemColProps={formItemColProps} />
            </Card>
          )}
        </>
      )}
    </Form>
  );
};
