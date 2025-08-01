import React from 'react';
import { Button, ButtonProps, Checkbox, Col, Form } from 'antd';
import { FormCommonProps, transformSettings } from '../settings-common';
import { useModalBindingsProps } from '../../../hooks';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../components/modalWrapper';
import { Grid, TextFormItem } from '../../../components';
import { UpdateDeviceSettingRequest } from '../../../apis/device';
import { useContext } from '..';
import { DeviceType } from '../../../types/device_type';

type Props = Omit<ButtonProps, 'form'> & FormCommonProps;

export const CanCopySettings = (props: Props) => {
  const { device, form, ...rest } = props;
  const { can, formProps, handleClick, modalProps, checkGroupProps, checkAllProps, devices } =
    useProps(form, device);
  return (
    can && (
      <>
        <Button {...rest} onClick={handleClick} />
        <ModalWrapper {...modalProps}>
          <Form {...formProps}>
            <TextFormItem name='ids'>
              <Checkbox.Group {...checkGroupProps}>
                <Grid>
                  <Col span={24}>
                    <Checkbox {...checkAllProps} />
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
            </TextFormItem>
          </Form>
        </ModalWrapper>
      </>
    )
  );
};

const useProps = (settingsForm: FormCommonProps['form'], device: Props['device']) => {
  const [form] = Form.useForm();
  const { handleClick, ...rest } = useTrigger(settingsForm);
  const devices = useDevicesWithSameTypes(device);
  const { indeterminate, ...checkGroupProps } = useGroupProps(
    form,
    devices.map(({ id }) => id)
  );
  return {
    can:
      devices.length > 0 &&
      DeviceType.isSensor(device.typeId) &&
      !DeviceType.isMultiChannel(device.typeId),
    formProps: { form, style: { marginTop: 16 } },
    handleClick,
    modalProps: useModalProps({ form, ...rest, device }),
    checkGroupProps,
    checkAllProps: { children: intl.get('SELECT_ALL'), indeterminate, value: 0 },
    devices
  };
};

const useTrigger = (form: FormCommonProps['form']) => {
  const [open, setOpen] = React.useState(false);
  const [submitedValues, setSubmitedValues] = React.useState<any>();
  return {
    open,
    setOpen,
    submitedValues,
    setSubmitedValues,
    handleClick: () => {
      form?.validateFields().then((settings) => {
        setOpen(true);
        setSubmitedValues(settings);
      });
    }
  };
};

const useDevicesWithSameTypes = (device: FormCommonProps['device']) => {
  const { devices } = useContext();
  return devices.filter((d) => d.typeId === device.typeId && d.id !== device.id);
};

const useModalProps = ({
  open,
  setOpen,
  submitedValues,
  setSubmitedValues,
  device,
  form
}: FormCommonProps & TriggerProps) => {
  const { handleSubmit, loading } = useCopy({
    id: device.id,
    settings: submitedValues,
    onSuccess: () => {
      setOpen(false);
      setSubmitedValues(undefined);
    }
  });
  return useModalBindingsProps({
    afterClose: () => form?.resetFields(),
    okButtonProps: { loading },
    okText: intl.get('SAVE'),
    onCancel: () => setOpen(false),
    onOk: () => form?.validateFields().then(handleSubmit),
    open
  });
};

const useCopy = ({
  id,
  settings,
  onSuccess
}: {
  id: number;
  settings: any;
  onSuccess?: () => void;
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (values: { ids: number[] }) => {
    if (values.ids.length > 0 && settings) {
      setLoading(true);
      UpdateDeviceSettingRequest(
        id,
        {
          ...settings,
          sensors: transformSettings(settings.sensors)
        },
        values.ids.filter((id) => id !== 0)
      )
        .then(() => {
          onSuccess?.();
        })
        .finally(() => setLoading(false));
    }
  };

  return { loading, handleSubmit };
};

type TriggerProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitedValues: any;
  setSubmitedValues: React.Dispatch<any>;
};

const useGroupProps = (form: FormCommonProps['form'], deviceIds: number[]) => {
  const [prevIds, setPrevIds] = React.useState<number[]>([]);
  const indeterminate =
    prevIds.filter((id) => id !== 0).length > 0 &&
    prevIds.filter((id) => id !== 0).length < deviceIds.length;
  const onChange = (e: number[]) => {
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
    form?.setFieldsValue({ ids });
    setPrevIds(ids);
  };
  return { onChange, style: { width: '100%' }, indeterminate };
};
