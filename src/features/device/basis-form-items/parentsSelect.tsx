import React from 'react';
import { Select, SelectProps, Space, Typography } from 'antd';
import { toMac } from '../../../utils/format';
import { DeviceType } from '../../../types/device_type';
import { useAppType } from '../../../config';
import { Device } from '../../../types/device';
import { foreachTree } from '../../../utils/tree';
import { DeviceTreeNode } from '../deviceTree';
import { useContext } from '..';

type Parent = Device & { gatewayId: number };

type ParentSelectOption = {
  value: string;
  label: string;
  macAddress: string;
  gatewayId: number;
};

export function ParentsSelect({
  device,
  dispalyField = 'id',
  ...rest
}: SelectProps & { dispalyField?: keyof Pick<Device, 'id' | 'macAddress'>; device?: Device }) {
  const appType = useAppType();
  const { devices } = useContext();
  const parents: Parent[] = [];
  let all = devices.filter((d) =>
    [...DeviceType.getGateways(), DeviceType.Router].includes(d.typeId)
  );

  foreachTree(buildParentsTreeData(all), (dev, path) => {
    const current = { ...dev, gatewayId: path?.[0] } as Parent;
    if (device) {
      if (!path?.includes(device.id)) {
        parents.push(current);
      }
    } else {
      parents.push(current);
    }
  });

  return (
    <Select
      {...rest}
      options={
        parents
          .sort((d1, d2) => d1.id - d2.id)
          .map((d) => ({
            value: d[dispalyField],
            label: d.name,
            macAddress: d.macAddress,
            gatewayId: d.gatewayId
          })) as ParentSelectOption[]
      }
      optionRender={(option) => (
        <Space direction='vertical'>
          <Typography.Text strong>{option.data.label}</Typography.Text>
          {appType !== 'corrosionWirelessHART' && (
            <Typography.Text type={'secondary'}>
              {toMac(option.data.macAddress.toUpperCase())}
            </Typography.Text>
          )}
        </Space>
      )}
    />
  );
}

function buildParentsTreeData(devices: Device[]): DeviceTreeNode[] {
  const nodes: DeviceTreeNode[] = [];
  devices.forEach((dev) => {
    if (DeviceType.isGateway(dev.typeId)) {
      const { name, id, children, macAddress } = getDeviceWithChildren(dev, devices);
      nodes.push({
        ...dev,
        title: name,
        key: `${id}`,
        children,
        value: toMac(macAddress.toUpperCase())
      });
    }
  });
  return nodes;
}

function getDeviceWithChildren(dev: Device, devices: Device[]): DeviceTreeNode {
  const children = devices.filter((d) => d.parent === dev.macAddress);
  return {
    ...dev,
    title: dev.name,
    key: `${dev.id}`,
    children: children.map((d) => getDeviceWithChildren(d, devices)),
    value: toMac(dev.macAddress.toUpperCase())
  };
}
