import * as React from 'react';
import { Col, Collapse, Empty } from 'antd';
import intl from 'react-intl-universal';
import dayjs from '../../utils/dayjsUtils';
import { FindDeviceDataRequest } from '../../apis/device';
import { Device } from '../../types/device';
import { DeviceType } from '../../types/device_type';
import { Card, Grid, LightSelectFilter } from '../../components';
import { DisplayProperty, displayPropertyGroup } from '../../constants/properties';
import { generateColProps } from '../../utils/grid';
import { HistoryDataFea } from '../../features';
import { HistoryData } from '../asset-common';
import { getDisplayProperties } from './util';

export const RecentHistory: React.FC<{ device: Device }> = ({ device }) => {
  const channels = DeviceType.isMultiChannel(device.typeId, true);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const [channel, setChannel] = React.useState('1');

  React.useEffect(() => {
    FindDeviceDataRequest(
      device.id,
      dayjs().startOf('day').subtract(13, 'd').utc().unix(),
      dayjs().endOf('day').utc().unix(),
      channels.length > 0 ? { channel } : {}
    ).then(setHistoryData);
  }, [device.id, channel, channels.length]);

  if (!historyData || historyData.length === 0) {
    return (
      <Card
        extra={
          channels.length > 0 && (
            <LightSelectFilter
              allowClear={false}
              onChange={setChannel}
              options={channels}
              value={channel}
              prefix={intl.get('CURRENT_CHANNEL')}
            />
          )
        }
      >
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  } else if (DeviceType.isVibration(device.typeId)) {
    return (
      <Collapse
        defaultActiveKey={displayPropertyGroup[0]}
        expandIconPosition='end'
        items={displayPropertyGroup.map((g) => ({
          key: g,
          label: intl.get(g),
          children: (
            <Grid>
              {getDisplayProperties(device.properties, device.typeId)
                .filter((p) => p.group === g)
                .map((p: DisplayProperty, index: number) => {
                  return (
                    <Col {...generateColProps({ md: 12, lg: 12, xl: 8, xxl: 6 })} key={index}>
                      <HistoryDataFea.PropertyChartCard data={historyData} property={p} />
                    </Col>
                  );
                })}
            </Grid>
          )
        }))}
        size='small'
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.01)' }}
      />
    );
  } else {
    return (
      <Grid>
        {getDisplayProperties(device.properties, device.typeId).map(
          (p: DisplayProperty, index: number) => {
            return (
              <Col {...generateColProps({ md: 12, lg: 12, xl: 8, xxl: 6 })} key={index}>
                <HistoryDataFea.PropertyChartCard data={historyData} property={p} />
              </Col>
            );
          }
        )}
      </Grid>
    );
  }
};
