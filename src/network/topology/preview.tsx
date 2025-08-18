import React from 'react';
import { BasicDataNode } from 'antd/es/tree';
import { mapTree } from '../../utils/tree';
import { Device } from '../../types/device';
import { toMac } from '../../utils/format';
import { Card, CardProps } from '../../components';
import { useGlobalStyles } from '../../styles';
import { TreeChart } from './treeChart';

type DeviceEx = Device & { address: string; parentAddress: string };

export type DeviceTreeNode = DeviceEx & {
  key: string;
  title: React.ReactNode;
  children: DeviceEx[];
  value: number | string;
} & BasicDataNode;

export const Preview = ({ devices, ...rest }: { devices: DeviceEx[] } & CardProps) => {
  const { colorWarningHoverStyle, colorTextStyle } = useGlobalStyles();
  const leaveNodes = [];
  const treeData: DeviceTreeNode[] = mapTree(buildDeviceTreeData(devices, devices[0]), (device) => {
    if (!device.hasOwnProperty('children') || device.children.length === 0) {
      leaveNodes.push(device);
    }
    return {
      ...device,
      label: { backgroundColor: colorWarningHoverStyle.color, color: colorTextStyle.color }
    };
  });

  return (
    <Card
      {...rest}
      style={{ height: 'calc(100vh - 178px)' }}
      styles={{ body: { maxHeight: 'calc(100vh - 234px)', overflow: 'auto' } }}
    >
      <TreeChart {...rest} treeData={treeData} height={Math.max(leaveNodes.length * 70, 600)} />
    </Card>
  );
};

function buildDeviceTreeData(devices: DeviceEx[], root: DeviceEx): DeviceTreeNode[] {
  const nodes: DeviceTreeNode[] = [];
  devices.forEach((dev) => {
    if (dev.address === root.address) {
      const { name, id, children, address } = getDeviceWithChildren(dev, devices);
      nodes.push({
        ...dev,
        title: name,
        key: `${id}`,
        children,
        value: toMac(address.toUpperCase())
      });
    }
  });
  return nodes;
}

function getDeviceWithChildren(dev: DeviceEx, devices: DeviceEx[]): DeviceTreeNode {
  // add condition: 'd.parentAddress !== d.address'
  // in order to filter devices from uploaded json file which's address is equal to it's parentAddress
  const children = devices.filter(
    (d) => d.parentAddress === dev.address && d.parentAddress !== d.address
  );
  return {
    ...dev,
    title: dev.name,
    key: `${dev.id}`,
    children: children.map((d) => getDeviceWithChildren(d, devices)),
    value: toMac(dev.address.toUpperCase())
  };
}
