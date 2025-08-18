import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Segmented, Spin, Tooltip } from 'antd';
import { GatewayOutlined, UnorderedListOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { mapTree } from '../../utils/tree';
import { ColorHealth } from '../../constants/color';
import {
  DeviceTreeNode,
  useDeviceOnlineLiving,
  useDeviceTreeData
} from '../../features/device/deviceTree';
import { Device } from '../../types/device';
import { useContext } from '../../features/device';
import { useGlobalStyles } from '../../styles';
import { Card } from '../../components';
import { DevicesTable } from '../devicesTable';
import { TreeChart } from './treeChart';

export function Status({ device }: { device: Device }) {
  const navigate = useNavigate();
  useDeviceOnlineLiving();
  const options = [
    {
      label: intl.get('network.topology'),
      value: 0,
      icon: <GatewayOutlined />
    },
    {
      label: intl.get('devices'),
      value: 1,
      icon: <UnorderedListOutlined />
    }
  ];
  const [type, setType] = React.useState(options[0].value);
  const { devicesLoading } = useContext();
  const { colorWarningHoverStyle, colorWhiteStyle, colorTextStyle } = useGlobalStyles();
  const leaveNodes = [];
  const treeData: DeviceTreeNode[] = mapTree(useDeviceTreeData(device), (device) => {
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
        <Card
          extra={
            <Segmented
              options={options.map((opt) => ({
                value: opt.value,
                icon: <Tooltip title={opt.label}>{opt.icon}</Tooltip>
              }))}
              onChange={setType}
              value={type}
            />
          }
          style={{ height: 'calc(100vh - 178px)' }}
          styles={{ body: { maxHeight: 'calc(100vh - 234px)', overflow: 'auto' } }}
          title={options.find((opt) => opt.value === type)?.label}
        >
          {type === 0 ? (
            <TreeChart
              treeData={treeData}
              height={Math.max(leaveNodes.length * 70, 600)}
              onClick={(paras: any) => {
                if (paras && paras.data && paras.data.id) {
                  navigate(`/devices/${paras.data.id}`);
                }
              }}
            />
          ) : (
            <DevicesTable device={device} />
          )}
        </Card>
      )}
    </Spin>
  );
}
