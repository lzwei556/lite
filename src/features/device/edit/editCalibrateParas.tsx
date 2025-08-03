import { Button, Form } from 'antd';
import intl from 'react-intl-universal';
import { DeviceType } from '../../../types/device_type';
import { Property } from '../../../types/property';
import { ModalWrapper } from '../../../components/modalWrapper';
import { NumberFormItem, SelectFormItem } from '../../../components';
import { SVT } from '../calibration/svt';

type Paras = { param: number; channel?: number; sub_command?: number };

const EditCalibrateParas = ({
  typeId,
  properties,
  open,
  setVisible,
  onUpdate
}: {
  typeId: number;
  properties: Property[];
  open: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate: (val: Paras) => void;
}) => {
  const [form] = Form.useForm();
  const typeParaMapping = new Map();
  typeParaMapping.set(DeviceType.SAS, 'preload');
  typeParaMapping.set(DeviceType.SAS120D, 'preload');
  typeParaMapping.set(DeviceType.SAS120Q, 'preload');
  typeParaMapping.set(DeviceType.DS4, 'preload');
  typeParaMapping.set(DeviceType.DS8, 'preload');
  DeviceType.getDCSensors().forEach((dcType) => typeParaMapping.set(dcType, 'thickness'));
  typeParaMapping.set(DeviceType.PressureGuoDa, 'pressure');
  typeParaMapping.set(DeviceType.PressureWoErKe, 'pressure');
  typeParaMapping.set(DeviceType.SPT510, 'pressure');
  const property = properties.find((pro) => pro.key === typeParaMapping.get(typeId))!;
  const isSVT = DeviceType.isVibration(typeId);
  const isSPT = DeviceType.isSPT(typeId);
  const channels = DeviceType.getChannels(typeId);

  function handleSubmit(param?: number) {
    if (param !== undefined) {
      onUpdate({ param });
    } else {
      form.validateFields().then((values) => {
        let paras: Paras = { param: Number(values.param) };
        if (values.channel) {
          paras = { ...paras, channel: Number(values.channel) };
        }
        if (values.sub_command) {
          paras = { ...paras, sub_command: Number(values.sub_command) };
        }
        onUpdate(paras);
      });
    }
  }

  return (
    <ModalWrapper
      afterClose={() => form.resetFields()}
      width={420}
      open={open}
      title={intl.get('CALIBRATION_PARAMETERS')}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key='cancel' onClick={() => setVisible(false)}>
          {intl.get('CANCEL')}
        </Button>,
        isSPT && (
          <Button key='submit_0' onClick={() => handleSubmit(0)}>
            {intl.get('ZERO_CALIBRATE')}
          </Button>
        ),
        <Button
          key='submit'
          type='primary'
          onClick={() => {
            handleSubmit();
          }}
        >
          {isSPT ? intl.get('LINEAR_CALIBRATE') : intl.get('CALIBRATE')}
        </Button>
      ]}
    >
      <Form form={form} labelCol={{ span: 8 }}>
        {isSVT ? (
          <SVT
            typeId={typeId}
            properties={properties}
            onChange={(axis) => form.setFieldValue('sub_command', axis)}
          />
        ) : (
          <>
            <NumberFormItem
              label={property.name}
              name='param'
              rules={[{ required: true }]}
              inputNumberProps={{ addonAfter: property.unit }}
            />
            {channels.length > 0 && (
              <SelectFormItem
                label='CHANNEL'
                name='channel'
                rules={[{ required: true }]}
                initialValue={1}
                selectProps={{ options: channels }}
              />
            )}
          </>
        )}
      </Form>
    </ModalWrapper>
  );
};

export default EditCalibrateParas;
