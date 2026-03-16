import React from 'react';
import { Dropdown, MenuProps, Space } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { Device } from '../../../types/device';
import { toMac } from '../../../utils/format';
import { DeleteIconButton, EditIconButton, IconButton, Table, Link } from '../../../components';
import { DeleteDeviceRequest, GetDeviceRequest } from '../../../apis/device';
import { DeviceType } from '../../../types/device_type';
import { tree2List } from '../../../utils/tree';
import { CommandDropdown } from '../commandDropdown';
import { useDeviceOnlineLiving, useDeviceTreeData } from '../deviceTree';
import { SingleDeviceStatus } from '../../../device/SingleDeviceStatus';
import { useContext } from '..';
import { BasisModalForm } from './basisModalForm';
import { SettingsModalForm } from './settingsModalForm';
import { CanAccess, Permission, useCan } from '../../../providers/access-control';

export const DevicesTable = ({ device, onUpdate }: { device: Device; onUpdate: () => void }) => {
  const canEditDevice = useCan(Permission.DeviceEdit);
  const canEditDeviceSettings = useCan(Permission.DeviceSettingsEdit);
  useDeviceOnlineLiving();
  const { refresh } = useContext();
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState<string | undefined>();
  const [updatedDevice, setUpdatedDevice] = React.useState<Device | undefined>();

  const dataSource = tree2List(useDeviceTreeData(device)).filter(
    (d) => d.macAddress !== device.macAddress
  );

  const renderMenus = (device: Device) => {
    const items: MenuProps['items'] = [];
    if (canEditDevice) {
      items.push({ key: 'edit', label: Translation.editSth('device') });
    }
    if (canEditDeviceSettings) {
      items.push({ key: 'editSettings', label: Translation.editSth('common.settings') });
    }
    return {
      items,
      onClick: ({ key }: { key: string }) => {
        setOpen(true);
        setKey(key);
        GetDeviceRequest(device.id).then(setUpdatedDevice);
      }
    };
  };

  const columns = [
    {
      key: 'state',
      title: Translation.get('common.status'),
      render: (_: string, device: Device) => {
        return <SingleDeviceStatus device={device} />;
      }
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: Translation.get('device.name'),
      render: (name: string, device: Device) => <Link to={`/devices/${device.id}`}>{name}</Link>
    },
    {
      dataIndex: 'macAddress',
      key: 'mac',
      title: Translation.get('device.mac-address'),
      render: (mac: string) => toMac(mac.toUpperCase())
    },
    {
      dataIndex: 'typeId',
      key: 'type',
      title: Translation.get('device.type'),
      render: (id: number) => Translation.get(DeviceType.toString(id))
    },
    {
      key: 'action',
      title: Translation.get('common.operation'),
      render: (_: any, device: Device) => {
        return (
          <Space>
            {DeviceType.hasDeviceSettings(device.typeId) ? (
              (canEditDevice || canEditDeviceSettings) && (
                <Dropdown menu={renderMenus(device)}>
                  <EditIconButton />
                </Dropdown>
              )
            ) : (
              <EditIconButton
                onClick={() => {
                  setOpen(true);
                  setKey('edit');
                  GetDeviceRequest(device.id).then(setUpdatedDevice);
                }}
              />
            )}
            <CanAccess {...Permission.DeviceCommand}>
              <CommandDropdown
                device={device}
                target={<IconButton icon={<CodeOutlined />} size='small' variant='outlined' />}
              />
            </CanAccess>
            <CanAccess {...Permission.DeviceDelete}>
              <DeleteIconButton
                confirmProps={{
                  description: Translation.get('feedback.prompt.delete'),
                  onConfirm: () => DeleteDeviceRequest(device.id).then(() => refresh())
                }}
              />
            </CanAccess>
          </Space>
        );
      }
    }
  ];

  const reset = () => {
    setOpen(false);
    setUpdatedDevice(undefined);
  };

  return (
    <>
      <Table
        cardProps={{ title: Translation.get('devices') }}
        columns={columns}
        dataSource={dataSource}
        rowKey={(row) => row.id}
      />
      {open && key === 'edit' && updatedDevice && (
        <BasisModalForm
          device={updatedDevice}
          open={open}
          onCancel={reset}
          onSuccess={() => {
            reset();
            onUpdate();
          }}
        />
      )}
      {open && key === 'editSettings' && updatedDevice && (
        <SettingsModalForm device={updatedDevice} open={open} onCancel={reset} onSuccess={reset} />
      )}
    </>
  );
};
