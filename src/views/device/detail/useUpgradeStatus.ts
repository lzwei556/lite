import React from 'react';
import useSocket, { SocketTopic } from '../../../socket';
import { Device } from '../../../types/device';

export function useUpgrageStatus(device: Device) {
  const [upgradeStatus, setUpgradeStatus] = React.useState<any>(device.upgradeStatus);
  const { PubSub } = useSocket();

  React.useEffect(() => {
    PubSub.subscribe(SocketTopic.upgradeStatus, (msg: string, status: any) => {
      if (device.macAddress === status.macAddress) {
        console.log('upgradeStatus:', status);
        setUpgradeStatus({ code: status.code, progress: status.progress });
      }
    });
    return () => {
      PubSub.unsubscribe(SocketTopic.upgradeStatus);
    };
  }, [PubSub, device.macAddress]);
  return upgradeStatus;
}
