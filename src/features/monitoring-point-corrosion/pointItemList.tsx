import React from 'react';
import { Button, Col, ColProps, Form, Popover } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Device } from '../../types/device';
import { Grid, NumberFormItem, TextFormItem } from '../../components';
import { generateColProps } from '../../utils/grid';
import { isMobile } from '../../utils/deviceDetection';
import { GetDevicesRequest } from '../../apis/device';
import { DeviceSelection, MonitoringPointInfo } from '../../asset-common';
import { useGlobalStyles } from '../../styles';
import { relatedDeviceTypes } from './common';
import { Others } from './others';

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
  const { colorBorderStyle } = useGlobalStyles();

  React.useEffect(() => {
    const deviceTypes = relatedDeviceTypes.get(type);
    if (deviceTypes) GetDevicesRequest({ types: deviceTypes.join(',') }).then(setDevices);
  }, [type]);

  return (
    <Form.List
      name='monitoring_points'
      rules={[
        {
          validator: async (_, points) => {
            if (!points || points.length <= 0) {
              return Promise.reject(new Error(intl.get('PLEASE_CREATE_MONITORING_POINT')));
            }
          }
        }
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restFields }, index) => (
            <div
              key={index}
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
                    label='NAME'
                    name={[name, 'name']}
                    rules={[{ required: true }, { min: 4, max: 50 }]}
                  />
                </Col>
                <Col {...formItemColProps}>
                  <NumberFormItem
                    {...restFields}
                    label='POSITION'
                    name={[name, 'attributes', 'index']}
                    rules={[{ required: true }]}
                  />
                </Col>
                <Others {...restFields} nameIndex={name} formItemColProps={formItemColProps} />
              </Grid>
            </div>
          ))}
          <TextFormItem>
            <Popover
              title={intl.get('SELECT_SENSOR')}
              content={
                open && (
                  <DeviceSelection
                    devices={devices}
                    onSelect={(selecteds) => {
                      setVisible(false);
                      onSelect(
                        selecteds.map((m) => ({
                          ...m,
                          attributes: {
                            corrosion_rate_short_term: 30,
                            corrosion_rate_long_term: 365,
                            initial_thickness: { enabled: false },
                            critical_thickness: { enabled: false }
                          }
                        }))
                      );
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
              <Button disabled={devices.length === 0}>{intl.get('SELECT_SENSOR')}</Button>
              <Form.ErrorList errors={errors} />
            </Popover>
          </TextFormItem>
        </>
      )}
    </Form.List>
  );
};
