import React from 'react';
import { Button, Form, Result } from 'antd';
import { ModalWrapper } from '../../../components/modalWrapper';
import { Card } from '../../../components';
import { ModalFormProps } from '../../../types/common';
import * as WSN from '../../../wsn';
import * as Basis from '../basis-form-items';
import { isBLEGateway, SettingsFormItems } from '../settings-common';
import { useProps } from './hooks';

export const AddModal = (props: ModalFormProps) => {
  return (
    <Basis.ContextProvier>
      <ModalForm {...props} />
    </Basis.ContextProvier>
  );
};

const ModalForm = (props: ModalFormProps) => {
  const {
    modalProps,
    success,
    result,
    continueButtonProps,
    closeButtonProps,
    formProps,
    deviceType,
    basis,
    settings,
    wsn
  } = useProps(props);
  return (
    <ModalWrapper {...modalProps}>
      {success && (
        <Result
          {...result}
          extra={[
            <Button key='continue' {...continueButtonProps} />,
            <Button key='close' {...closeButtonProps} />
          ]}
        />
      )}
      {!success && (
        <Form {...formProps}>
          <Card {...basis.cardProps}>
            <Basis.FormItems {...basis.formItemsProps} />
          </Card>
          {deviceType && (
            <>
              <SettingsFormItems {...settings} />
              {isBLEGateway(deviceType) && (
                <Card {...wsn.cardProps}>
                  <WSN.FormItems {...wsn.formItemsProps} />
                </Card>
              )}
            </>
          )}
        </Form>
      )}
    </ModalWrapper>
  );
};
