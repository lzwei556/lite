import React from 'react';
import { Button, Col, ColProps, Form, Popover } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { Device } from '../../types/device';
import { generateColProps } from '../../utils/grid';
import { Grid, NumberFormItem, TextFormItem } from '../../components';
import { GetDevicesRequest } from '../../apis/device';
import { isMobile } from '../../utils/deviceDetection';
import { DeviceSelection, MonitoringPointInfo, Point } from '../../asset-common';
import { useGlobalStyles } from '../../styles';
import * as Tower from './tower';
import { MonitoringPointType } from 'common';

export const PointItemList = ({
  onSelect,
  onRemove,
  initialSelected,
  type,
  formItemColProps = generateColProps({ xl: 12, xxl: 12 })
}: {
  onSelect: (points: MonitoringPointInfo[]) => void;
  onRemove: (index: number) => void;
  initialSelected: MonitoringPointInfo[];
  type: number;
  formItemColProps?: ColProps;
}) => {
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [open, setVisible] = React.useState(false);
  const isTowerRelated = Point.Assert.isTowerRelated(type);
  const { colorBorderStyle } = useGlobalStyles();

  React.useEffect(() => {
    const deviceTypes = MonitoringPointType.Key.getDeviceTypes(type);
    if (deviceTypes) GetDevicesRequest({ types: deviceTypes.join(',') }).then(setDevices);
  }, [type]);

  return (
    <Form.List
      name='monitoring_points'
      rules={[
        {
          validator: async (_, points) => {
            if (!points || points.length <= 0) {
              return Promise.reject(new Error(Translation.get('feedback.empty.mp.creation')));
            }
          }
        }
      ]}
    >
      {(fields, { remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restFields }, index) => (
            <div
              style={{
                position: 'relative',
                border: `dashed 1px ${colorBorderStyle.color}`,
                paddingTop: 16,
                marginBottom: 16
              }}
            >
              <MinusCircleOutlined
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => {
                  remove(name);
                  onRemove(index);
                }}
              />
              <Grid>
                <Col {...formItemColProps}>
                  <TextFormItem
                    {...restFields}
                    label='common.name'
                    name={[name, 'name']}
                    rules={[{ required: true }, { min: 4, max: 50 }]}
                  />
                  <TextFormItem name={[name, 'channel']} hidden={true} />
                </Col>
                <Col {...formItemColProps}>
                  <NumberFormItem
                    {...restFields}
                    label='monitoring.point.position'
                    name={[name, 'attributes', 'index']}
                    rules={[{ required: true }]}
                    inputNumberProps={{ min: 1 }}
                  />
                </Col>
                {isTowerRelated && (
                  <Tower.Index
                    {...restFields}
                    formItemColProps={formItemColProps}
                    nameIndex={name}
                    type={type}
                  />
                )}
              </Grid>
            </div>
          ))}
          <TextFormItem>
            <Popover
              title={Translation.doSth('common.action.select', 'device.sensors')}
              content={
                open && (
                  <DeviceSelection
                    devices={devices}
                    onSelect={(selecteds) => {
                      setVisible(false);
                      onSelect(selecteds);
                    }}
                    initialSelected={initialSelected}
                  />
                )
              }
              trigger={['click']}
              placement={isMobile ? 'top' : 'rightTop'}
              open={open}
              onOpenChange={(open) => setVisible(open)}
              overlayStyle={{ width: 400 }}
            >
              <Button disabled={devices.length === 0}>
                {Translation.doSth('common.action.select', 'device.sensors')}
              </Button>
              <Form.ErrorList errors={errors} />
            </Popover>
          </TextFormItem>
        </>
      )}
    </Form.List>
  );
};
