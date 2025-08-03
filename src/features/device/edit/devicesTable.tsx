import React from 'react';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Device } from '../../../types/device';
import { toMac } from '../../../utils/format';
import { DeleteIconButton, EditIconButton, IconButton, Table, Link } from '../../../components';
import HasPermission from '../../../permission';
import usePermission, { Permission } from '../../../permission/permission';
import { DeleteDeviceRequest, GetDeviceRequest } from '../../../apis/device';
import { DeviceType } from '../../../types/device_type';
import { tree2List } from '../../../utils/tree';
import { CommandDropdown } from '../commandDropdown';
import { useDeviceOnlineLiving, useDeviceTreeData } from '../deviceTree';
import { SingleDeviceStatus } from '../../../device/SingleDeviceStatus';
import { useContext } from '..';
import { BasisModalForm } from './basisModalForm';
import { SettingsModalForm } from './settingsModalForm';

export const DevicesTable = ({ device, onUpdate }: { device: Device; onUpdate: () => void }) => {
  const { hasPermission } = usePermission();
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
    if (hasPermission(Permission.DeviceEdit)) {
      items.push({ key: 'edit', label: intl.get('EDIT_DEVICE_INFO') });
    }
    if (hasPermission(Permission.DeviceSettingsEdit)) {
      items.push({ key: 'editSettings', label: intl.get('EDIT_DEVICE_SETTINGS') });
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
      title: intl.get('STATUS'),
      render: (_: string, device: Device) => {
        return <SingleDeviceStatus device={device} />;
      }
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: intl.get('DEVICE_NAME'),
      render: (name: string, device: Device) => <Link to={`/devices/${device.id}`}>{name}</Link>
    },
    {
      dataIndex: 'macAddress',
      key: 'mac',
      title: intl.get('MAC_ADDRESS'),
      render: (mac: string) => toMac(mac.toUpperCase())
    },
    {
      dataIndex: 'typeId',
      key: 'type',
      title: intl.get('DEVICE_TYPE'),
      render: (id: number) => intl.get(DeviceType.toString(id))
    },
    {
      key: 'action',
      title: intl.get('OPERATION'),
      render: (_: any, device: Device) => {
        return (
          <Space>
            {DeviceType.hasDeviceSettings(device.typeId) ? (
              (hasPermission(Permission.DeviceEdit) ||
                hasPermission(Permission.DeviceSettingsEdit)) && (
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
            <HasPermission value={Permission.DeviceCommand}>
              <CommandDropdown
                device={device}
                target={
                  <IconButton title={intl.get('DEVICE_COMMANDS')}>
                    <Button icon={<CodeOutlined />} size='small' variant='outlined' />
                  </IconButton>
                }
              />
            </HasPermission>
            <HasPermission value={Permission.DeviceDelete}>
              <DeleteIconButton
                confirmProps={{
                  description: intl.get('DELETE_DEVICE_PROMPT'),
                  onConfirm: () => DeleteDeviceRequest(device.id).then(() => refresh())
                }}
              />
            </HasPermission>
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
        cardProps={{ size: 'small', title: intl.get('MENU_DEVICE_LSIT') }}
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
