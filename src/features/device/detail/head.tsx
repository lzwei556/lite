import React from 'react';
import { Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExportOutlined, PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Device } from '../../../types/device';
import { DeviceType } from '../../../types/device_type';
import HasPermission from '../../../permission';
import { Permission } from '../../../permission/permission';
import { DeleteIconButton, DownloadIconButton, IconButton } from '../../../components';
import { DeleteNetworkRequest, ExportNetworkRequest } from '../../../apis/network';
import { DeleteDeviceRequest } from '../../../apis/device';
import { Network } from '../../../network';
import { useContext } from '..';
import { CommandDropdown } from '../commandDropdown';
import DownloadModal from './downloadModal';

export const HeadRight = ({ device, network }: { device: Device; network?: Network }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDevice, refresh } = useContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Button.Group style={{ marginLeft: 30 }}>
      {DeviceType.isGateway(device.typeId) && network && (
        <>
          <HasPermission value={Permission.NetworkExport}>
            <IconButton
              icon={<ExportOutlined />}
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
              tooltipProps={{ title: intl.get('EXPORT_NETWORK') }}
              type='primary'
              variant='solid'
            />
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
          <IconButton
            icon={<PlusOutlined />}
            onClick={() => navigate('create')}
            tooltipProps={{
              title: intl.get('CREATE_SOMETHING', { something: intl.get('DEVICE') })
            }}
            type='primary'
            variant='solid'
          />
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
          <DownloadIconButton
            onClick={() => setOpen(true)}
            tooltipProps={{ title: intl.get('DOWNLOAD_DATA') }}
            type='primary'
            variant='solid'
          />
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
