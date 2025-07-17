import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumb, Button, Col, Form, message, Result } from 'antd';
import { ImportOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { ImportNetworkRequest } from '../../../apis/network';
import { DeviceType } from '../../../types/device_type';
import { generateColProps } from '../../../utils/grid';
import { Card, Flex, Grid, JsonImporter, Link } from '../../../components';
import * as WSN from '../../../features/wsn';
import { useContext, VIRTUAL_ROOT_DEVICE } from '../../device';
import { Preview } from '../topology/preview';

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
  wsn: WSN.WSN;
  deviceList: ImportedJSONDevice[];
};

const ImportNetworkPage = () => {
  const initialNetwork = {
    deviceList: [],
    wsn: { provisioning_mode: WSN.ProvisioningMode.TimeDivision, ...WSN.getInitialSettings() }
  };
  const [network, setNetwork] = useState<ValidJson>(initialNetwork);
  const { deviceList, wsn } = network;
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const devicesContext = useContext();
  const checkJSONFormat = (source: any) => {
    return source.hasOwnProperty('deviceList') && source.hasOwnProperty('wsn');
  };
  const isGatewayBLE = deviceList.length > 0 && DeviceType.isBLEGateway(deviceList[0].type);

  const onSave = () => {
    if (deviceList.length === 0) {
      message.error(intl.get('PLEASE_UPLOAD_FILE'));
      return;
    }
    if (deviceList) {
      form.validateFields().then((values) => {
        const req = {
          mode: values.mode,
          wsn: values.wsn ?? network.wsn,
          devices: deviceList.map((d) => {
            return {
              name: d.name,
              mac_address: d.address,
              parent_address: d.parentAddress,
              type_id: d.type,
              settings: d.settings,
              protocol: d.protocol
            };
          })
        };
        ImportNetworkRequest(req).then((_) => {
          setSuccess(true);
          devicesContext.refresh();
        });
      });
    } else {
      message.error(intl.get('DO_NOT_IMPORT_EMPTY_NETWORK')).then();
    }
  };

  const reset = () => {
    setNetwork(initialNetwork);
    form.resetFields();
  };

  return (
    <Grid>
      <Col span={24}>
        <Card styles={{ body: { paddingBlock: 8 } }}>
          <Flex justify='space-between' align='center'>
            <Breadcrumb
              items={[
                { title: <Link to='/devices/0'>{VIRTUAL_ROOT_DEVICE.name}</Link> },
                { title: intl.get('MENU_IMPORT_NETWORK') }
              ]}
            />
            {!success && (
              <Button type='primary' onClick={onSave}>
                {intl.get('SAVE_NETWORK')}
                <ImportOutlined />
              </Button>
            )}
          </Flex>
        </Card>
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
                      {intl.get('RESET')}
                    </Button>
                  }
                  title={intl.get('PREVIEW')}
                />
              ) : (
                <Card>
                  <JsonImporter
                    onUpload={(json: any) => {
                      return new Promise(() => {
                        if (checkJSONFormat(json)) {
                          setNetwork({ wsn: json.wsn, deviceList: json.deviceList });
                          form.setFieldsValue(WSN.tranformWSN2WSNUpdate(json.wsn));
                        }
                      });
                    }}
                    dragger={true}
                  />
                </Card>
              )}
            </Col>
            {isGatewayBLE && (
              <Col flex='300px'>
                <Card size='small' title={intl.get('EDIT')}>
                  <Form form={form} layout='vertical'>
                    <WSN.FormItems
                      formItemColProps={generateColProps({})}
                      initial={wsn}
                      setFieldsValue={form.setFieldsValue}
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
              title={intl.get('NETWORK_IMPORTED_SUCCESSFUL')}
              subTitle={intl.get('NETWORK_IMPORTED_NEXT_PROMPT')}
              extra={[
                <Button type='primary' key='devices' onClick={() => navigate('/devices/0')}>
                  {intl.get('RETURN')}
                </Button>,
                <Button
                  key='add'
                  onClick={() => {
                    reset();
                    setSuccess(false);
                  }}
                >
                  {intl.get('CONTINUE_TO_IMPORT_NETWORK')}
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
