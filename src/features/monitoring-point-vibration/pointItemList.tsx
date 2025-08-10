import React from 'react';
import { Button, Col, Form, Popover } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Grid, TextFormItem } from '../../components';
import { Device } from '../../types/device';
import { isMobile } from '../../utils/deviceDetection';
import { generateColProps } from '../../utils/grid';
import { GetDevicesRequest } from '../../apis/device';
import { AXIS, AXIS_ALIAS, DeviceSelection, MonitoringPointInfo } from '../../asset-common';
import { useGlobalStyles } from '../../styles';
import { relatedDeviceTypes } from './common';
import { Others } from './others';

export const PointItemList = ({
  onSelect,
  onRemove,
  initialSelected,
  type
}: {
  onSelect: (points: MonitoringPointInfo[]) => void;
  onRemove: (index: number) => void;
  initialSelected: MonitoringPointInfo[];
  type: number;
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
                <Col {...generateColProps({ xl: 12, xxl: 12 })}>
                  <TextFormItem
                    {...restFields}
                    label='NAME'
                    name={[name, 'name']}
                    rules={[{ required: true }, { min: 4, max: 50 }]}
                  />
                </Col>
                <Others
                  formItemColProps={generateColProps({ xl: 12, xxl: 12 })}
                  nameIndex={name}
                  restFields={restFields}
                />
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
                            [AXIS_ALIAS.Axial.key]: AXIS.Z.key,
                            [AXIS_ALIAS.Horizontal.key]: AXIS.X.key,
                            [AXIS_ALIAS.Vertical.key]: AXIS.Y.key
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
