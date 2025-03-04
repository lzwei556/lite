import React from 'react';
import { Col, Empty, Skeleton } from 'antd';
import { Card, Grid } from '../../../components';
import { Device } from '../../../types/device';
import { RecentHistory } from '../RecentHistory';
import { useContext } from '..';
import { SingleDeviceDetail } from './information/SingleDeviceDetail';
import { DeviceType } from '../../../types/device_type';

export const SensorDetail = ({ device }: { device: Device }) => {
  const { loading } = useContext();
  if (!device) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }
  return (
    <Grid>
      <Col span={24}>
        <Skeleton loading={loading}>
          <SingleDeviceDetail device={device} />
        </Skeleton>
      </Col>
      {DeviceType.isSensor(device.typeId) && (
        <Col span={24}>
          <RecentHistory device={device} key={device.id} />
        </Col>
      )}
    </Grid>
  );
};
