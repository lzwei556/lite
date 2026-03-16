import React, { useState, useEffect } from 'react';
import { Dropdown, MenuProps, message } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { DeviceCommand } from '../../types/device_command';
import { DeviceType } from '../../types/device_type';
import { DeviceUpgradeRequest, SendDeviceCommandRequest } from '../../apis/device';
import UpgradeModal from './upgrade';
import EditCalibrateParas from './edit/editCalibrateParas';
import { Device } from '../../types/device';
import useSocket, { SocketTopic } from '../../socket';
import { IsUpgrading } from '../../types/device_upgrade_status';
import { isMobile } from '../../utils/deviceDetection';
import { NetworkProvisionRequest, NetworkSyncRequest } from '../../apis/network';
import { Network } from '../../types/network';
import { useAppType } from '../../config';
import { IconButton } from '../../components';
import { Compensation } from './edit/compensation';
import { Permission, useCan } from '../../providers/access-control';
import { FillModalForm } from './edit/fillModalForm';

export const CommandDropdown = ({
  device,
  target,
  initialUpgradeCode,
  network
}: {
  device: Device;
  target?: JSX.Element;
  initialUpgradeCode?: number;
  network?: Network;
}) => {
  const appType = useAppType();
  const { id, typeId, macAddress } = device;
  const { PubSub } = useSocket();
  const [upgradedCode, setUpgradeCode] = useState(initialUpgradeCode ?? device.upgradeStatus?.code);
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const [openCalibrate, setVisibleCalibrate] = useState(false);
  const chanels = DeviceType.getChannels(typeId);
  const [compensationOpen, setCompensationOpen] = useState(false);
  const [fillOpen, setFillOpen] = useState(false);

  useEffect(() => {
    PubSub.subscribe(SocketTopic.upgradeStatus, (msg: string, status: any) => {
      if (macAddress === status.macAddress) {
        setUpgradeCode(status.code);
      }
    });
    return () => {
      PubSub.unsubscribe(SocketTopic.upgradeStatus);
    };
  }, [PubSub, macAddress]);

  const handelMenuClick = ({ key }: any) => {
    if (key === 'sync') {
      if (network) {
        NetworkSyncRequest(network.id).then((res) => {
          if (res.code === 200) {
            message.success(Translation.get('feedback.success.send'));
          } else {
            message.error(
              `${Translation.failureDo('common.action.send')}${Translation.get(res.msg)}`
            );
          }
        });
      }
    } else if (key === 'provision') {
      if (network) {
        NetworkProvisionRequest(network.id).then((res) => {
          if (res.code === 200) {
            message.success(Translation.get('feedback.success.send'));
          } else {
            message.error(
              `${Translation.failureDo('common.action.send')}${Translation.get(res.msg)}`
            );
          }
        });
      }
    } else {
      let commandKey = Number(key);
      let channel = undefined;
      if (Number.isNaN(commandKey)) {
        try {
          const commands: [number, number] = JSON.parse(key);
          commandKey = commands[0];
          channel = commands[1];
        } catch (error) {}
      }
      switch (commandKey) {
        case DeviceCommand.Upgrade:
          setUpgradeVisible(true);
          break;
        case DeviceCommand.CancelUpgrade:
          DeviceUpgradeRequest(id, { type: DeviceCommand.CancelUpgrade }).then((res) => {
            if (res.code === 200) {
              message.success(Translation.get('feedback.success.upgrade.cancel'));
            } else {
              message.error(`${Translation.failureDo('common.action.cancel')},${res.msg}`);
            }
          });
          break;
        case DeviceCommand.Calibrate:
          setVisibleCalibrate(true);
          break;
        case DeviceCommand.Compensation:
          setCompensationOpen(true);
          break;
        case DeviceCommand.Fill:
          setFillOpen(true);
          break;
        default:
          SendDeviceCommandRequest(id, commandKey, channel ? { channel } : {}).then((res) => {
            if (res.code === 200) {
              message.success(Translation.get('feedback.success.send'));
            } else {
              message.error(Translation.failureDo('common.action.send'));
            }
          });
          break;
      }
    }
  };

  const upgrading = upgradedCode && IsUpgrading(upgradedCode);

  type MenuItem = Required<MenuProps>['items'][number];
  const items: MenuProps['items'] = [];
  const canUpgrade = useCan(Permission.DeviceUpgrade);

  if (DeviceType.OilFiller === typeId) {
    items.push({ key: DeviceCommand.Fill, label: Translation.get('device.command.fill') });
  } else {
    if (!upgrading) {
      if (DeviceType.isGateway(typeId)) {
        items.push({ key: 'sync', label: Translation.get('device.command.network.sync') });
        items.push({ key: 'provision', label: Translation.get('device.command.provision') });
      }
      items.push({ key: DeviceCommand.Reboot, label: Translation.get('device.command.restart') });
      if (DeviceType.isSensor(typeId)) {
        const resetItem: MenuItem = {
          key: DeviceCommand.ResetData,
          label: Translation.get('device.command.data.reset')
        };
        if (chanels.length > 0) {
          items.push({
            ...resetItem,
            children: chanels.map((c) => ({
              key: `[${DeviceCommand.ResetData},${c.value}]`,
              label: c.label
            }))
          });
        } else {
          items.push({
            key: DeviceCommand.AcquireSensorData,
            label: Translation.get('device.command.acquisition')
          });
          items.push(resetItem);
        }
      }
      items.push({ key: DeviceCommand.Reset, label: Translation.get('device.command.restore') });
      if (DeviceType.canSupportingCalibrate(typeId)) {
        items.push({
          key: DeviceCommand.Calibrate,
          label: Translation.get('device.command.calibration')
        });
      }
      if (DeviceType.canSupportingCompensation(typeId)) {
        items.push({
          key: DeviceCommand.Compensation,
          label: Translation.get('device.command.compensation')
        });
      }
    }
    if (canUpgrade) {
      if (!upgrading) {
        if (appType !== 'corrosionWirelessHART') {
          items.push({
            key: DeviceCommand.Upgrade,
            label: Translation.get('device.command.upgrade')
          });
        }
      } else {
        items.push({
          key: DeviceCommand.CancelUpgrade,
          label: Translation.get('device.command.upgrade.cancel')
        });
      }
    }
  }

  return (
    <>
      <Dropdown
        menu={{ items, onClick: handelMenuClick, disabled: !device.state?.isOnline }}
        trigger={isMobile ? ['click'] : ['hover']}
      >
        {target ?? (
          <IconButton
            icon={<MoreOutlined />}
            tooltipProps={{ title: Translation.get('device.commands') }}
            type='primary'
            variant='solid'
          />
        )}
      </Dropdown>
      {upgradeVisible && (
        <UpgradeModal
          open={upgradeVisible}
          device={device}
          onSuccess={() => {
            setUpgradeVisible(false);
          }}
          onCancel={() => {
            setUpgradeVisible(false);
          }}
        />
      )}
      {openCalibrate && (
        <EditCalibrateParas
          open={openCalibrate}
          setVisible={setVisibleCalibrate}
          typeId={typeId}
          properties={device.properties}
          onUpdate={(paras) => {
            setVisibleCalibrate(false);
            SendDeviceCommandRequest(id, DeviceCommand.Calibrate, paras).then((res) => {
              if (res.code === 200) {
                message.success(Translation.get('feedback.success.send')).then();
              } else {
                message.error(Translation.get(res.msg)).then();
              }
            });
          }}
        />
      )}
      {compensationOpen && (
        <Compensation
          open={compensationOpen}
          onCancel={() => setCompensationOpen(false)}
          onSuccess={(paras) => {
            SendDeviceCommandRequest(id, DeviceCommand.Compensation, paras).then((res) => {
              if (res.code === 200) {
                message.success(Translation.get('feedback.success.send'));
              } else {
                message.error(Translation.get(res.msg));
              }
            });
            setCompensationOpen(false);
          }}
        />
      )}
      {fillOpen && (
        <FillModalForm
          open={fillOpen}
          onCancel={() => setFillOpen(false)}
          onSuccess={(params) => {
            SendDeviceCommandRequest(id, DeviceCommand.Fill, params).then((res) => {
              if (res.code === 200) {
                message.success(Translation.get('feedback.success.send'));
              } else {
                message.error(Translation.get(res.msg));
              }
            });
            setFillOpen(false);
          }}
        />
      )}
    </>
  );
};
