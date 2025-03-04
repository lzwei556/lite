import React from 'react';
import { Badge, Spin, Tree } from 'antd';
import { BasicDataNode } from 'antd/es/tree';
import { useNavigate } from 'react-router-dom';
import { Device } from '../../types/device';
import { useContext, VIRTUAL_ROOT_DEVICE } from '.';
import { DeviceNS } from './util';
import useSocket, { SocketTopic } from '../../socket';
import { toMac, truncate } from '../../utils/format';

export const DeviceTree = ({
  height,
  onClick,
  selectedKeys
}: {
  height: number;
  onClick?: () => void;
  selectedKeys?: string[];
}) => {
  const navigate = useNavigate();
  useDeviceOnlineLiving();
  const { devicesLoading } = useContext();
  const treeData = useDeviceTreeData();

  return (
    <Spin spinning={devicesLoading}>
      {!devicesLoading && (
        <Tree
          defaultExpandAll={true}
          selectedKeys={selectedKeys}
          showIcon={true}
          treeData={treeData}
          titleRender={(node) => {
            const title = truncate(node.title as string, 14);
            return <Badge status={node?.state?.isOnline ? 'success' : 'default'} text={title} />;
          }}
          height={height}
          onClick={onClick}
          onSelect={(keys, e: any) => {
            const id = `${e.node.key}`;
            navigate(`/devices/${id}`);
          }}
        />
      )}
    </Spin>
  );
};

export function useDeviceOnlineLiving() {
  const { device, setDevice, setDevices } = useContext();
  const { PubSub } = useSocket();
  React.useEffect(() => {
    PubSub.subscribe(SocketTopic.connectionState, (msg: any, state: any) => {
      if (device && device.macAddress === state.macAddress) {
        setDevice({ ...device, state: { ...device.state, isOnline: state.isOnline } });
      }
      setDevices((prev) =>
        prev.map((d) => {
          if (d.macAddress === state.macAddress) {
            return { ...d, state: { ...d.state, isOnline: state.isOnline } };
          } else {
            return d;
          }
        })
      );
    });
    return () => {
      PubSub.unsubscribe(SocketTopic.connectionState);
    };
  }, [PubSub, device, setDevice, setDevices]);
}

export function useDeviceTreeData(root?: Device) {
  const { devices: originalDevices } = useContext();
  const devices = originalDevices.filter((d) => (root ? d.macAddress !== root.macAddress : true));
  const rootNode = root ? root : (VIRTUAL_ROOT_DEVICE as Device);
  const devs: Device[] = [rootNode];
  if (devices.length > 0) {
    devs.push(
      ...devices.map((d) => {
        if (DeviceNS.Assert.isRoot(d) && rootNode.macAddress === VIRTUAL_ROOT_DEVICE.macAddress) {
          return { ...d, parent: rootNode.macAddress };
        } else {
          return d;
        }
      })
    );
  }
  return buildDeviceTreeData(devs, rootNode);
}

export type DeviceTreeNode = Device & {
  key: string;
  title: React.ReactNode;
  children: Device[];
  value: number | string;
} & BasicDataNode;

function buildDeviceTreeData(devices: Device[], root: Device): DeviceTreeNode[] {
  const nodes: DeviceTreeNode[] = [];
  devices.forEach((dev) => {
    if (dev.macAddress === root.macAddress) {
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
