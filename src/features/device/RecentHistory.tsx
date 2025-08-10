import * as React from 'react';
import { Col, Collapse, Empty } from 'antd';
import intl from 'react-intl-universal';
import { Dayjs } from '../../utils';
import { FindDeviceDataRequest } from '../../apis/device';
import { Device } from '../../types/device';
import { DeviceType } from '../../types/device_type';
import { Card, Grid, LightSelectFilter } from '../../components';
import { DisplayProperty, displayPropertyGroup } from '../../constants/properties';
import { generateColProps } from '../../utils/grid';
import { useGlobalStyles } from '../../styles';
import { HistoryData } from '../../asset-common';
import { HistoryDataFea } from '..';
import { getDisplayProperties } from './util';

export const RecentHistory: React.FC<{ device: Device }> = ({ device }) => {
  const channels = DeviceType.getChannels(device.typeId);
  const [historyData, setHistoryData] = React.useState<HistoryData>();
  const [channel, setChannel] = React.useState('1');
  const { propertyHistoryCardStyle, colorBgContainerStyle } = useGlobalStyles();

  React.useEffect(() => {
    const [from, to] = Dayjs.toRange(Dayjs.CommonRange.PastHalfMonth);
    FindDeviceDataRequest(device.id, from, to, channels.length > 0 ? { channel } : {}).then(
      setHistoryData
    );
  }, [device.id, channel, channels.length]);

  const channelsSelect = channels.length > 0 && (
    <LightSelectFilter
      allowClear={false}
      onChange={setChannel}
      options={channels}
      value={channel}
      prefix={intl.get('CURRENT_CHANNEL')}
    />
  );

  const getCols = (propertyNums: number) => {
    if (propertyNums < 3) {
      return generateColProps({
        md: 24 / propertyNums,
        lg: 24 / propertyNums,
        xl: 24 / propertyNums,
        xxl: 24 / propertyNums
      });
    } else {
      return generateColProps({ md: 12, lg: 12, xl: 12, xxl: 8 });
    }
  };

  if (!historyData || historyData.length === 0) {
    return (
      <Card extra={channelsSelect}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  } else if (DeviceType.isVibration(device.typeId)) {
    return (
      <Collapse
        bordered={false}
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
                    <Col {...generateColProps({ md: 12, lg: 12, xl: 12, xxl: 8 })} key={index}>
                      <HistoryDataFea.PropertyChartCard
                        data={historyData}
                        property={p}
                        cardProps={propertyHistoryCardStyle}
                      />
                    </Col>
                  );
                })}
            </Grid>
          )
        }))}
        size='small'
        style={{ borderRadius: 0, backgroundColor: colorBgContainerStyle.backgroundColor }}
      />
    );
  } else {
    const chartGrid = (
      <Grid>
        {getDisplayProperties(device.properties, device.typeId).map(
          (p: DisplayProperty, index: number) => {
            return (
              <Col {...getCols(device.properties.length)} key={index}>
                <HistoryDataFea.PropertyChartCard
                  data={historyData}
                  property={p}
                  cardProps={propertyHistoryCardStyle}
                />
              </Col>
            );
          }
        )}
      </Grid>
    );
    if (channels.length > 0) {
      return <Card extra={channelsSelect}>{chartGrid}</Card>;
    } else {
      return chartGrid;
    }
  }
};
