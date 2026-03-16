import React from 'react';
import { Col, Empty, Typography } from 'antd';
import { Translation } from 'locales/utils';
import { Card, Descriptions, Grid, Link, MutedCard } from '../../../components';
import { Dayjs, toMac } from '../../../utils';
import { Device } from '../../../types/device';
import { DeviceType } from '../../../types/device_type';
import { RecentHistory } from '../RecentHistory';
import { DeviceStatus } from '../device-status';

export const SensorDetail = ({ device }: { device: Device }) => {
  const basisFields = useBasisFields(device);
  const timeFields = useTimeFileds(device);
  if (!device) {
    return (
      <Card>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  return (
    <Grid wrap={false}>
      <Col flex='auto'>
        <MutedCard title={Translation.get('feature.real-time')}>
          <RecentHistory device={device} key={device.id} />
        </MutedCard>
      </Col>
      <Col flex='300px'>
        <Grid>
          <DeviceStatus device={device} />
          <Col span={24}>
            <MutedCard title={Translation.get('common.basic')}>
              <Descriptions
                column={1}
                contentStyle={{
                  justifyContent: 'flex-start'
                }}
                items={[...basisFields, ...timeFields]}
                layout='vertical'
              />
            </MutedCard>
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};

export const useBasisFields = (device: Device) => {
  const { macAddress, typeId, parentName, information, tag, applicationId } = device;
  const version = information?.firmware_version;
  const productId = information?.product_id;
  const fields = [
    {
      label: Translation.get('device.mac-address'),
      children: (
        <Typography.Text
          copyable={{
            text: macAddress
          }}
        >
          {toMac(macAddress.toUpperCase())}
        </Typography.Text>
      )
    },
    {
      label: Translation.get('device.type'),
      children: Translation.get(DeviceType.toString(typeId))
    }
  ];
  if (parentName) {
    fields.push({ label: Translation.get('device.parent'), children: parentName });
  }
  fields.push({
    label: Translation.get('firmware.version'),
    children: version && productId ? `${version}(${productId})` : '-'
  });
  const ipAddress = information?.ip_address;
  if (ipAddress) {
    fields.push({
      label: Translation.get('device.ip-address'),
      children: (
        <Link to={`http://${ipAddress}`} target={'_blank'}>
          {ipAddress}
        </Link>
      )
    });
  }
  const iccid = information?.iccid_4g;
  if (iccid) {
    fields.push({ label: Translation.get('device.iccid.4g'), children: iccid });
  }
  if (tag) {
    fields.push({ label: Translation.get('device.tag'), children: tag });
  }
  if (applicationId) {
    fields.push({ label: Translation.get('device.application-id'), children: applicationId });
  }
  return fields;
};

export const useTimeFileds = (device: Device) => {
  const { state, data } = device;
  const connectedAt = state?.connectedAt;
  const timestamp = data?.timestamp;
  const fields = [
    {
      label: Translation.get('device.status.connected-at'),
      children: connectedAt ? Dayjs.format(connectedAt) : '-'
    }
  ];
  if (timestamp) {
    fields.push({
      label: Translation.get('device.data.timestamp'),
      children: timestamp ? Dayjs.format(timestamp) : '-'
    });
  }
  return fields;
};
