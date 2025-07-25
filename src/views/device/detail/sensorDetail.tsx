import React from 'react';
import { Col, Empty, Typography } from 'antd';
import intl from 'react-intl-universal';
import { Card, Descriptions, Grid, Link, MetaCard } from '../../../components';
import { Dayjs, toMac } from '../../../utils';
import { Device } from '../../../types/device';
import { DeviceType } from '../../../types/device_type';
import { useLocaleContext } from '../../../localeProvider';
import { RecentHistory } from '../RecentHistory';
import { DeviceStatus } from '../device-status';

export const SensorDetail = ({ device }: { device: Device }) => {
  const { language } = useLocaleContext();
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
        <MetaCard
          description={<RecentHistory device={device} key={device.id} />}
          title={intl.get('real.time.data')}
        />
      </Col>
      <Col flex='300px'>
        <Grid>
          <DeviceStatus device={device} />
          <Col span={24}>
            <MetaCard
              description={
                <Descriptions
                  column={1}
                  contentStyle={{
                    justifyContent: language === 'en-US' ? 'flex-start' : 'flex-end'
                  }}
                  items={[...basisFields, ...timeFields]}
                  layout={language === 'en-US' ? 'vertical' : 'horizontal'}
                />
              }
              title={intl.get('BASIC_INFORMATION')}
            />
          </Col>
        </Grid>
      </Col>
    </Grid>
  );
};

export const useBasisFields = (device: Device) => {
  const { macAddress, typeId, parentName, information } = device;
  const version = information?.firmware_version;
  const productId = information?.product_id;
  const fields = [
    {
      label: intl.get('MAC_ADDRESS'),
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
      label: intl.get('DEVICE_TYPE'),
      children: intl.get(DeviceType.toString(typeId))
    }
  ];
  if (parentName) {
    fields.push({ label: intl.get('PARENT'), children: parentName });
  }
  fields.push({
    label: intl.get('FIRMWARE_VERSION'),
    children: version && productId ? `${version}(${productId})` : '-'
  });
  const ipAddress = information?.ip_address;
  if (ipAddress) {
    fields.push({
      label: intl.get('IP_ADDRESS'),
      children: (
        <Link to={`http://${ipAddress}`} target={'_blank'}>
          {ipAddress}
        </Link>
      )
    });
  }
  const iccid = information?.iccid_4g;
  if (iccid) {
    fields.push({ label: intl.get('4G_CARD_NO'), children: iccid });
  }
  return fields;
};

export const useTimeFileds = (device: Device) => {
  const { state, data } = device;
  const connectedAt = state?.connectedAt;
  const timestamp = data?.timestamp;
  const fields = [
    {
      label: intl.get('LAST_CONNECTION_TIME'),
      children: connectedAt ? Dayjs.format(connectedAt) : '-'
    }
  ];
  if (timestamp) {
    fields.push({
      label: intl.get('LAST_SAMPLING_TIME'),
      children: timestamp ? Dayjs.format(timestamp) : '-'
    });
  }
  return fields;
};
