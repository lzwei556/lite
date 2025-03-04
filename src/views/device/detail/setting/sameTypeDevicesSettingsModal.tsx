import React from 'react';
import { Checkbox, Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../../components/modalWrapper';
import { Grid } from '../../../../components';
import { ModalFormProps } from '../../../../types/common';
import { UpdateDeviceSettingRequest } from '../../../../apis/device';
import { Device } from '../../../../types/device';
import { processArrayValuesInSensorSetting } from '../../../../components/formItems/deviceSettingFormItem';
import { useContext } from '../..';

export const SameTypeDevicesSettingsModal = (
  props: ModalFormProps & { device: Device; submitedValues: any }
) => {
  const { device, onSuccess, submitedValues, ...rest } = props;
  const { devices } = useContext();
  const sameTypeOthers = devices.filter((d) => d.typeId === device.typeId && d.id !== device.id);
  const deviceIds = sameTypeOthers.map((d) => d.id);
  const [form] = Form.useForm();
  const [prevIds, setPrevIds] = React.useState<number[]>([]);
  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      title={intl.get('SELECT_DEVICE')}
      okText={intl.get('SAVE')}
      onOk={() =>
        form.validateFields().then((values: { ids: number[] }) =>
          UpdateDeviceSettingRequest(
            device.id,
            {
              ...submitedValues,
              sensors: processArrayValuesInSensorSetting(submitedValues.sensors)
            },
            values.ids.filter((id) => id !== 0)
          ).then(() => {
            onSuccess();
          })
        )
      }
    >
      <Form form={form} style={{ marginTop: 16 }}>
        <Form.Item name='ids'>
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={(e) => {
              let ids: number[] = [];
              if (prevIds.includes(0)) {
                if (!e.includes(0) || (e.length === 1 && e[0] === 0)) {
                  ids = [];
                } else {
                  ids = e;
                }
              } else {
                if (e.includes(0) || e.length === deviceIds.length) {
                  ids = [0, ...deviceIds];
                } else {
                  ids = e;
                }
              }
              form.setFieldsValue({ ids });
              setPrevIds(ids);
            }}
          >
            <Grid>
              <Col span={24}>
                <Checkbox
                  indeterminate={
                    prevIds.filter((id) => id !== 0).length > 0 &&
                    prevIds.filter((id) => id !== 0).length < deviceIds.length
                  }
                  value={0}
                >
                  {intl.get('SELECT_ALL')}
                </Checkbox>
              </Col>
              <Col span={24}>
                <Grid gutter={[10, 10]}>
                  {sameTypeOthers.map((dev) => (
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
