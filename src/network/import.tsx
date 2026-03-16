import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumb, Button, Col, Form, message, Result } from 'antd';
import { Translation } from 'locales/utils';
import { ImportNetworkRequest } from '../apis/network';
import { DeviceType } from '../types/device_type';
import { generateColProps } from '../utils/grid';
import { Card, Grid, JsonImporter, Link, SaveIconButton, TitleExtraLayout } from '../components';
import * as WSN from '../wsn';
import { useContext } from '../features/device';
import { Preview } from './topology/preview';
import { WanProtocol } from '../features/device/basis-form-items';
import { useVirtualRootDevice } from '../features/device/virtual';

export type ImportedJSONDevice = {
  id: number;
  name: string;
  address: string;
  parentAddress: string;
  type: number;
  settings: any;
  protocol: number;
};

type ValidJson = {
  wsn?: WSN.WSNDTO['exported'];
  deviceList: ImportedJSONDevice[];
};

const GatewayLoraTypeTLV = 2147483653;

const ImportNetworkPage = () => {
  const initialNetwork = { deviceList: [] };
  const [network, setNetwork] = useState<ValidJson>(initialNetwork);
  const { deviceList, wsn } = network;
  const initialValues = WSN.transform(wsn);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const devicesContext = useContext();
  const checkJSONFormat = (source: any) => {
    return source.hasOwnProperty('deviceList') && source.hasOwnProperty('wsn');
  };
  const rootDevice = useVirtualRootDevice();

  const verifyGatewayBLE = () => {
    if (deviceList.length > 0) {
      const { type } = deviceList[0];
      if (DeviceType.isBLEGateway(type)) {
        return true;
      } else if (type > 10000 && type !== GatewayLoraTypeTLV) {
        return true;
      }
    }
    return false;
  };

  const onSave = () => {
    if (deviceList.length === 0) {
      message.error(Translation.pleaseDoSth('common.action.upload', 'common.file'));
      return;
    }
    if (deviceList) {
      form.validateFields().then((values) => {
        const req = {
          ...WSN.transform2UpdateDTO(values),
          devices: deviceList.map((d) => {
            return {
              name: d.name,
              mac_address: d.address,
              parent_address: d.parentAddress,
              type_id: d.type,
              settings: d.settings,
              protocol: d.protocol ?? WanProtocol.Tlv
            };
          })
        };
        ImportNetworkRequest(req).then((_) => {
          setSuccess(true);
          devicesContext.refresh();
        });
      });
    } else {
      message.error(Translation.get('feedback.empty.network.import')).then();
    }
  };

  const reset = () => {
    setNetwork(initialNetwork);
    form.resetFields();
  };

  return (
    <Grid>
      <Col span={24}>
        <TitleExtraLayout
          title={
            <Breadcrumb
              items={[
                { title: <Link to='/devices'>{rootDevice.name}</Link> },
                { title: Translation.doSth('common.action.import', 'device.network') }
              ]}
            />
          }
          extra={
            !success && (
              <SaveIconButton
                color='primary'
                onClick={onSave}
                size='middle'
                tooltipProps={{ title: Translation.get('common.action.save') }}
                variant='solid'
              />
            )
          }
          paddingBlock={14}
        />
      </Col>
      <Col span={24}>
        {!success && (
          <Grid wrap={false}>
            <Col flex='auto'>
              {deviceList.length > 0 ? (
                <Preview
                  devices={deviceList as any}
                  extra={
                    <Button type='link' onClick={reset}>
                      {Translation.get('common.action.reset')}
                    </Button>
                  }
                  title={Translation.get('common.action.preview')}
                />
              ) : (
                <Card>
                  <JsonImporter
                    onUpload={(json: any) => {
                      return new Promise(() => {
                        if (checkJSONFormat(json)) {
                          setNetwork({ wsn: json.wsn, deviceList: json.deviceList });
                        }
                      });
                    }}
                    dragger={true}
                  />
                </Card>
              )}
            </Col>
            {verifyGatewayBLE() && (
              <Col flex='300px'>
                <Card title={Translation.get('common.action.edit')}>
                  <Form form={form} layout='vertical' initialValues={initialValues}>
                    <WSN.FormItems
                      formItemColProps={generateColProps({})}
                      form={form}
                      initial={initialValues}
                    />
                  </Form>
                </Card>
              </Col>
            )}
          </Grid>
        )}
        {success && (
          <Card>
            <Result
              status='success'
              title={Translation.get('feedback.success.import.network')}
              extra={[
                <Button type='primary' key='devices' onClick={() => navigate('/devices/0')}>
                  {Translation.get('common.action.return')}
                </Button>,
                <Button
                  key='add'
                  onClick={() => {
                    reset();
                    setSuccess(false);
                  }}
                >
                  {Translation.get('common.action.continue')}
                </Button>
              ]}
            />
          </Card>
        )}
      </Col>
    </Grid>
  );
};

export default ImportNetworkPage;
