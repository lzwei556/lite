import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../../../types/common';
import { Device } from '../../../../../types/device';
import { ModalWrapper } from '../../../../../components/modalWrapper';
import { BasicSettingsFormItems } from '../_basicSettingsFormItems';
import { UpdateDeviceRequest } from '../../../../../apis/device';
import { getInitial } from '../basicSettings';

export const BasicSettingsModal = (props: ModalFormProps & { device: Device }) => {
  const { device, onSuccess, ...rest } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      okText={intl.get('SAVE')}
      onOk={() =>
        form.validateFields().then((values) => {
          setLoading(true);
          UpdateDeviceRequest(device.id, values).then((_) => {
            setLoading(false);
            onSuccess();
          });
        })
      }
      okButtonProps={{ loading }}
      title={intl.get('EDIT_SOMETHING', { something: intl.get('DEVICE') })}
    >
      <Form form={form} labelCol={{ xl: 9, xxl: 8 }} initialValues={getInitial(device)}>
        <BasicSettingsFormItems device={device} />
      </Form>
    </ModalWrapper>
  );
};
