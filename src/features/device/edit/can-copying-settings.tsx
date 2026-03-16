import React from 'react';
import { Button, ButtonProps, Checkbox, CheckboxChangeEvent, Col } from 'antd';
import { Translation } from 'locales/utils';
import { ModalWrapper } from '../../../components/modalWrapper';
import { Grid } from '../../../components';
import { useModalBindingsProps } from '../../../hooks';
import { UpdateDeviceSettingRequest } from '../../../apis/device';
import { DeviceType } from '../../../types/device_type';
import { FormCommonProps, transformSettings } from '../settings-common';
import { useContext } from '..';
import { useSelectAll } from 'hooks/select-all';

type Props = Omit<ButtonProps, 'form'> & FormCommonProps;

export const CanCopySettings = (props: Props) => {
  const { device, form, ...rest } = props;
  const { can, handleClick, modalProps, checkAllInputProps, getNonCheckAllInputProps, devices } =
    useProps(form, device);
  return (
    can && (
      <>
        <Button {...rest} onClick={handleClick} />
        <ModalWrapper {...modalProps}>
          <Grid>
            <Col span={24}>
              <Checkbox {...checkAllInputProps} />
            </Col>
            <Col span={24}>
              <Grid gutter={[10, 10]}>
                {devices.map((dev) => (
                  <Col key={dev.id} span={12}>
                    <Checkbox {...getNonCheckAllInputProps(dev)} />
                  </Col>
                ))}
              </Grid>
            </Col>
          </Grid>
        </ModalWrapper>
      </>
    )
  );
};

const useProps = (settingsForm: FormCommonProps['form'], device: Props['device']) => {
  const { handleClick, ...rest } = useTrigger(settingsForm);
  const devices = useDevicesWithSameTypes(device);
  const { selected, setSelected, isAllSelected, isIndeterminate, toggleSelectAll, toggleOne } =
    useSelectAll(devices.map(({ id }) => id));
  return {
    can:
      devices.length > 0 &&
      DeviceType.isSensor(device.typeId) &&
      !DeviceType.isMultiChannel(device.typeId),
    handleClick,
    modalProps: useModalProps({ ...rest, device, selected, setSelected }),
    checkAllInputProps: {
      checked: isAllSelected,
      children: Translation.get('common.action.select.all'),
      indeterminate: isIndeterminate,
      onChange: toggleSelectAll
    },
    getNonCheckAllInputProps: (device: Props['device']) => ({
      checked: selected.includes(device.id),
      children: device.name,
      onChange: (e: CheckboxChangeEvent) => toggleOne(e.target.value),
      value: device.id
    }),
    devices
  };
};

const useTrigger = (form: FormCommonProps['form']) => {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<any>();
  return {
    open,
    setOpen,
    settings,
    setSettings,
    handleClick: () => {
      form?.validateFields().then((settings) => {
        setOpen(true);
        setSettings(settings);
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
  settings,
  setSettings,
  device,
  selected,
  setSelected
}: FormCommonProps & TriggerProps) => {
  const { handleSubmit, loading } = useCopy({
    id: device.id,
    settings,
    onSuccess: () => {
      setOpen(false);
      setSettings(undefined);
      setSelected([]);
    }
  });
  return useModalBindingsProps({
    afterClose: () => setSelected([]),
    okButtonProps: { loading },
    okText: Translation.get('common.action.save'),
    onCancel: () => setOpen(false),
    onOk: () => handleSubmit(selected),
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

  const handleSubmit = (ids: number[]) => {
    if (ids.length > 0 && settings) {
      setLoading(true);
      UpdateDeviceSettingRequest(
        id,
        {
          ...settings,
          sensors: transformSettings(settings.sensors)
        },
        ids.filter((id) => id !== 0)
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
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
};
