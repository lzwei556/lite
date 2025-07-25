import React from 'react';
import { Button, Space } from 'antd';
import { Device } from '../../../types/device';
import { DeviceNavigator } from '../navigator';
import { SingleDeviceStatus } from '../SingleDeviceStatus';
import { DeviceType } from '../../../types/device_type';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { DeleteIconButton, IconButton } from '../../../components';
import intl from 'react-intl-universal';
import { DeleteNetworkRequest, ExportNetworkRequest } from '../../../apis/network';
import { DownloadOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { CommandDropdown } from '../commandDropdown';
import DownloadModal from './downloadModal';
import { DeleteDeviceRequest } from '../../../apis/device';
import { Network } from '../../../features/network';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from '..';
import { AddModal } from '../add/modal';

export const HeadLeft = ({
  device,
  size
}: {
  device: Device;
  size?: { width: number; height: number };
}) => {
  return (
    <Space style={{ marginRight: 30 }} size={30}>
      <DeviceNavigator id={device.id} containerDomWidth={size?.width} />
      <SingleDeviceStatus device={device} key={device.id} />
    </Space>
  );
};

export const HeadRight = ({ device, network }: { device: Device; network?: Network }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDevice, refresh } = useContext();

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  return (
    <Button.Group style={{ marginLeft: 30 }}>
      {DeviceType.isGateway(device.typeId) && network && (
        <>
          <HasPermission value={Permission.NetworkExport}>
            <IconButton title={intl.get('EXPORT_NETWORK')}>
              <Button
                type='primary'
                onClick={() => {
                  ExportNetworkRequest(network.id).then((res) => {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${network.name}.json`);
                    document.body.appendChild(link);
                    link.click();
                  });
                }}
                icon={<ExportOutlined />}
              />
            </IconButton>
          </HasPermission>
          <HasPermission value={Permission.NetworkDelete}>
            <DeleteIconButton
              confirmProps={{
                description: intl.get('DELETE_SOMETHING_PROMPT', {
                  something: network.gateway.name
                }),
                onConfirm: () => {
                  DeleteNetworkRequest(network.id).then(() => {
                    refresh();
                    navigate(`/devices/0`);
                  });
                },
                placement: 'top'
              }}
              buttonProps={{
                variant: 'solid',
                color: 'primary',
                size: 'middle',
                type: 'primary'
              }}
              tooltipProps={{ placement: 'top' }}
            />
          </HasPermission>
          <IconButton title={intl.get('CREATE_SOMETHING', { something: intl.get('DEVICE') })}>
            <Button type='primary' onClick={() => setOpen2(true)} icon={<PlusOutlined />} />
          </IconButton>
          {open2 && (
            <AddModal
              open={open2}
              onCancel={() => setOpen2(false)}
              onSuccess={() => setOpen2(false)}
            />
          )}
        </>
      )}
      {DeviceType.isRootDevice(device.typeId) && !DeviceType.isGateway(device.typeId) && (
        <HasPermission value={Permission.DeviceDelete}>
          <DeleteIconButton
            confirmProps={{
              description: intl.get('DELETE_SOMETHING_PROMPT', {
                something: device.name
              }),
              onConfirm: () => {
                DeleteDeviceRequest(device.id).then(() => {
                  refresh();
                  navigate(`/devices/0`);
                  setDevice(undefined);
                });
              },
              placement: 'top'
            }}
            buttonProps={{
              variant: 'solid',
              color: 'primary',
              size: 'middle',
              type: 'primary'
            }}
            tooltipProps={{ placement: 'top' }}
          />
        </HasPermission>
      )}
      {DeviceType.isSensor(device.typeId) && (
        <HasPermission value={Permission.DeviceData}>
          <IconButton title={intl.get('DOWNLOAD_DATA')}>
            <Button type='primary' onClick={() => setOpen(true)} icon={<DownloadOutlined />} />
          </IconButton>
          <DownloadModal
            open={open}
            onCancel={() => setOpen(false)}
            device={device}
            onSuccess={() => setOpen(false)}
          />
        </HasPermission>
      )}
      <HasPermission value={Permission.DeviceCommand}>
        <CommandDropdown device={device} initialUpgradeCode={location.state} network={network} />
      </HasPermission>
    </Button.Group>
  );
};
