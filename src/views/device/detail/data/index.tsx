import { FC, useCallback, useEffect, useState } from 'react';
import { Button, Col, Modal, Space as AntSpace, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Device } from '../../../../types/device';
import dayjs from '../../../../utils/dayjsUtils';
import {
  FindDeviceDataRequest,
  GetDeviceRuntimeRequest,
  RemoveDeviceDataRequest,
  RemoveDeviceRuntimeRequest
} from '../../../../apis/device';
import HasPermission from '../../../../permission';
import { Permission } from '../../../../permission/permission';
import { RangeDatePicker, oneWeekNumberRange } from '../../../../components/rangeDatePicker';
import { DeviceType } from '../../../../types/device_type';
import { DisplayProperty } from '../../../../constants/properties';
import { Card, Flex, Grid, LightSelectFilter, LineChart } from '../../../../components';
import { HistoryDataFea } from '../../../../features';
import { HistoryData } from '../../../asset-common';
import { getDisplayProperties } from '../../util';

export interface DeviceDataProps {
  device: Device;
}

const batteryVoltage: DisplayProperty = {
  key: 'batteryVoltage',
  name: 'BATTERY_VOLTAGE',
  precision: 0,
  unit: 'mV'
};
const signalStrength: DisplayProperty = {
  key: 'signalStrength',
  name: 'SIGNAL_STRENGTH',
  precision: 0,
  unit: 'dBm'
};

const HistoryDataPage: FC<DeviceDataProps> = ({ device }) => {
  const properties = getDisplayProperties(device.properties, device.typeId);
  if (!DeviceType.isWiredDevice(device.typeId)) {
    properties.push(batteryVoltage);
  }
  properties.push(signalStrength);
  const [property, setProperty] = useState<DisplayProperty | undefined>(
    properties.length > 0 ? properties[0] : undefined
  );
  const [range, setRange] = useState<[number, number]>(oneWeekNumberRange);
  const [dataSource, setDataSource] = useState<HistoryData>();
  const channels = DeviceType.isMultiChannel(device.typeId, true);
  const [channel, setChannel] = useState('1');
  const [runtimes, setRuntimes] = useState<
    {
      batteryVoltage: number;
      signalStrength: number;
      timestamp: number;
    }[]
  >([]);

  const fetchDeviceData = useCallback(() => {
    if (range) {
      const [from, to] = range;
      FindDeviceDataRequest(device.id, from, to, channels.length > 0 ? { channel } : {}).then(
        setDataSource
      );
      GetDeviceRuntimeRequest(device.id, from, to).then(setRuntimes);
    }
  }, [device.id, range, channel, channels.length]);

  useEffect(() => {
    fetchDeviceData();
  }, [fetchDeviceData]);

  const renderHistoryDataChart = () => {
    if (dataSource && dataSource.length > 0 && property) {
      if ([batteryVoltage, signalStrength].map(({ key }) => key).includes(property.key)) {
        if (runtimes.length > 0) {
          const xAxisValues = runtimes.map((item) =>
            dayjs.unix(item.timestamp).local().format('YYYY-MM-DD HH:mm:ss')
          );
          const { key, name } = property;
          return (
            <LineChart
              series={[
                {
                  data: {
                    [intl.formatMessage({ id: name })]: runtimes.map(
                      (item) => item[key as 'batteryVoltage' | 'signalStrength']
                    )
                  },
                  xAxisValues
                }
              ]}
              style={{ height: 650 }}
              yAxisMeta={property}
            />
          );
        }
      } else {
        return (
          <HistoryDataFea.PropertyChart
            config={{ opts: { yAxis: { name: property.unit } } }}
            data={dataSource}
            property={property}
            style={{ height: 650 }}
          />
        );
      }
    }
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  };

  const onRemoveDeviceData = () => {
    if (device) {
      if (range) {
        const [from, to] = range;
        Modal.confirm({
          title: intl.get('PROMPT'),
          content: intl.get('DELETE_DEVICE_DATA_PROMPT', {
            device: device.name,
            start: dayjs.unix(from).local().format('YYYY-MM-DD'),
            end: dayjs.unix(to).local().format('YYYY-MM-DD')
          }),
          okText: intl.get('OK'),
          cancelText: intl.get('CANCEL'),
          onOk: (close) => {
            RemoveDeviceDataRequest(device.id, from, to).then((_) => close());
            RemoveDeviceRuntimeRequest(device.id, from, to);
            fetchDeviceData();
          }
        });
      }
    }
  };

  return (
    <Grid>
      <Col span={24}>
        <Card>
          <Flex>
            <RangeDatePicker onChange={setRange} showFooter={true} />
          </Flex>
        </Card>
      </Col>
      <Col span={24}>
        <Card
          extra={
            <AntSpace style={{ textAlign: 'center' }} wrap={true}>
              {channels.length > 0 && (
                <LightSelectFilter
                  allowClear={false}
                  onChange={setChannel}
                  options={channels}
                  value={channel}
                  prefix={intl.get('CURRENT_CHANNEL')}
                />
              )}
              {dataSource && dataSource.length > 0 && (
                <>
                  {properties && property && (
                    <LightSelectFilter
                      allowClear={false}
                      onChange={(value) => {
                        setProperty(properties.find((item: any) => item.key === value));
                      }}
                      options={properties.map(({ name, key }) => ({
                        label: intl.get(name),
                        value: key
                      }))}
                      prefix={intl.get('PROPERTY')}
                      value={property.key}
                    />
                  )}
                  <HasPermission value={Permission.DeviceDataDelete}>
                    <Button
                      color='danger'
                      icon={<DeleteOutlined />}
                      onClick={onRemoveDeviceData}
                      variant='filled'
                    />
                  </HasPermission>
                </>
              )}
            </AntSpace>
          }
          title={device.name}
        >
          {renderHistoryDataChart()}
        </Card>
      </Col>
    </Grid>
  );
};

export default HistoryDataPage;
