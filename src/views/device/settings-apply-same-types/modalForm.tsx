import React from 'react';

import { Checkbox, Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { Device } from '../../../types/device';
import { ModalWrapper } from '../../../components/modalWrapper';
import { Grid } from '../../../components';
import { useOthersWithSameTypes, useProps, useUpdateSettingsWithSameTypes } from './hooks';

export const ModalForm = (props: ModalFormProps & { device: Device; submitedValues: any }) => {
  const { device, onSuccess, submitedValues, ...rest } = props;
  const devices = useOthersWithSameTypes(device);
  const deviceIds = devices.map(({ id }) => id);
  const { form, ids, indeterminate, onChange } = useProps(deviceIds);
  const { loading, handleSubmit } = useUpdateSettingsWithSameTypes({
    id: device.id,
    onSuccess,
    settings: submitedValues
  });
  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      title={intl.get('SELECT_DEVICE')}
      okText={intl.get('SAVE')}
      okButtonProps={{ loading, disabled: ids.length === 0 }}
      onOk={() => form.validateFields().then(handleSubmit)}
    >
      <Form form={form} style={{ marginTop: 16 }}>
        <Form.Item name='ids'>
          <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
            <Grid>
              <Col span={24}>
                <Checkbox indeterminate={indeterminate} value={0}>
                  {intl.get('SELECT_ALL')}
                </Checkbox>
              </Col>
              <Col span={24}>
                <Grid gutter={[10, 10]}>
                  {devices.map((dev) => (
                    <Col key={dev.id} span={12}>
                      <Checkbox value={dev.id}>{dev.name}</Checkbox>
                    </Col>
                  ))}
                </Grid>
              </Col>
            </Grid>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </ModalWrapper>
  );
};
