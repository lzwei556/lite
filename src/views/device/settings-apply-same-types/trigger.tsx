import React from 'react';
import { Button, ButtonProps, FormInstance } from 'antd';
import { Device } from '../../../types/device';
import { useSameTypeSettingsModalProps } from './hooks';
import { ModalForm } from './modalForm';

export const Trigger = (
  props: Omit<ButtonProps, 'form'> & { device: Device; form: FormInstance; onSuccess?: () => void }
) => {
  const { device, form, onSuccess, ...rest } = props;
  const { can, open, setOpen, submitedValues, setSubmitedValues } =
    useSameTypeSettingsModalProps(device);
  return (
    can && (
      <>
        <Button
          {...rest}
          onClick={() => {
            form.validateFields().then((settings) => {
              setOpen(true);
              setSubmitedValues(settings);
            });
          }}
        />
        {open && (
          <ModalForm
            device={device}
            open={open}
            onCancel={() => setOpen(false)}
            onSuccess={() => {
              setOpen(false);
              setSubmitedValues(undefined);
              onSuccess?.();
            }}
            submitedValues={submitedValues}
          />
        )}
      </>
    )
  );
};
