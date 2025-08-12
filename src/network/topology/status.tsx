import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { Network } from '../../types/network';
import { mapTree } from '../../utils/tree';
import { ColorHealth } from '../../constants/color';
import {
  DeviceTreeNode,
  useDeviceOnlineLiving,
  useDeviceTreeData
} from '../../features/device/deviceTree';
import { useContext } from '../../features/device';
import { useGlobalStyles } from '../../styles';
import { TreeChart } from './treeChart';

export function Status({ network }: { network: Network }) {
  const navigate = useNavigate();
  useDeviceOnlineLiving();
  const { devicesLoading } = useContext();
  const { colorWarningHoverStyle, colorWhiteStyle, colorTextStyle } = useGlobalStyles();
  const leaveNodes = [];
  const treeData: DeviceTreeNode[] = mapTree(useDeviceTreeData(network.gateway), (device) => {
    if (!device.hasOwnProperty('children') || device.children.length === 0) {
      leaveNodes.push(device);
    }
    return {
      ...device,
      label: {
        backgroundColor: device.state?.isOnline ? ColorHealth : colorWarningHoverStyle.color,
        color: device.state?.isOnline ? colorWhiteStyle.color : colorTextStyle.color
      }
    };
  });

  return (
    <Spin spinning={devicesLoading}>
      {!devicesLoading && (
        <TreeChart
          treeData={treeData}
          height={Math.max(leaveNodes.length * 70, 700)}
          onClick={(paras: any) => {
            if (paras && paras.data && paras.data.id) {
              navigate(`/devices/${paras.data.id}`);
            }
          }}
        />
      )}
    </Spin>
  );
}
