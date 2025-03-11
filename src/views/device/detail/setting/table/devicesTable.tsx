import React from 'react';
import { Button, Dropdown, MenuProps, Popconfirm, Space } from 'antd';
import { CodeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Device } from '../../../../../types/device';
import { SelfLink } from '../../../../../components/selfLink';
import { toMac } from '../../../../../utils/format';
import { Table } from '../../../../../components';
import HasPermission from '../../../../../permission';
import usePermission, { Permission } from '../../../../../permission/permission';
import { DeleteDeviceRequest, GetDeviceRequest } from '../../../../../apis/device';
import { DeviceType } from '../../../../../types/device_type';
import { tree2List } from '../../../../../utils/tree';
import { CommandDropdown } from '../../../commandDropdown';
import { useDeviceOnlineLiving, useDeviceTreeData } from '../../../deviceTree';
import { SingleDeviceStatus } from '../../../SingleDeviceStatus';
import { useContext } from '../../..';
import { BasicSettingsModal } from './basicSettingsModal';
import { DeviceSettingsModal } from './deviceSettingsModal';

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
      render: (state: any, device: Device) => {
        return <SingleDeviceStatus device={device} />;
      },
      width: 120
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: intl.get('DEVICE_NAME'),
      render: (name: string, device: Device) => (
        <SelfLink to={`/devices/${device.id}`}>{name}</SelfLink>
      ),
      width: 240
    },
    {
      dataIndex: 'macAddress',
      key: 'mac',
      title: intl.get('MAC_ADDRESS'),
      render: (mac: string) => toMac(mac.toUpperCase()),
      width: 120
    },
    {
      dataIndex: 'typeId',
      key: 'type',
      title: intl.get('DEVICE_TYPE'),
      render: (id: number) => intl.get(DeviceType.toString(id)),
      width: 120
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
                  <Button icon={<EditOutlined />} size='small' type='text' />
                </Dropdown>
              )
            ) : (
              <Button
                icon={<EditOutlined />}
                size='small'
                type='text'
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
                target={<Button icon={<CodeOutlined />} size='small' type='text' />}
              />
            </HasPermission>
            <HasPermission value={Permission.DeviceDelete}>
              <Popconfirm
                placement='left'
                title={intl.get('DELETE_DEVICE_PROMPT')}
                onConfirm={() => DeleteDeviceRequest(device.id).then(() => refresh())}
              >
                <Button danger={true} icon={<DeleteOutlined />} size='small' type='text' />
              </Popconfirm>
            </HasPermission>
          </Space>
        );
      },
      width: 150
    }
  ];

  const reset = () => {
    setOpen(false);
    setUpdatedDevice(undefined);
  };

  return (
    <>
      <Table
        cardProps={{ styles: { body: { padding: 0 } } }}
        columns={columns}
        dataSource={dataSource}
        rowKey={(row) => row.id}
      />
      {open && key === 'edit' && updatedDevice && (
        <BasicSettingsModal
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
        <DeviceSettingsModal
          device={updatedDevice}
          open={open}
          onCancel={reset}
          onSuccess={() => {
            reset();
            onUpdate();
          }}
        />
      )}
    </>
  );
};
