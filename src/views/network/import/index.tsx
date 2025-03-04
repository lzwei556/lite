import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumb, Button, Col, Form, message, Result, Upload } from 'antd';
import { ImportOutlined, InboxOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { ImportNetworkRequest } from '../../../apis/network';
import WsnFormItem from '../../../components/formItems/wsnFormItem';
import { useProvisionMode } from '../useProvisionMode';
import { Network } from '../../../types/network';
import { useLocaleFormLayout } from '../../../hooks/useLocaleFormLayout';
import { DeviceType } from '../../../types/device_type';
import { SelfLink } from '../../../components/selfLink';
import { Card, Flex, Grid } from '../../../components';
import { useContext, VIRTUAL_ROOT_DEVICE } from '../../device';
import { Preview } from '../topology/preview';

const { Dragger } = Upload;

export interface NetworkRequestForm {
  mode: number;
  wsn: any;
  devices: any;
}

const ImportNetworkPage = () => {
  const [network, setNetwork] = useState<any>();
  const [success, setSuccess] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [networkSettings, setNetworkSettings] = useState<any>();
  const [provisionMode, setProvisionMode, settings] = useProvisionMode(networkSettings);
  const navigate = useNavigate();
  const devicesContext = useContext();
  const checkJSONFormat = (source: any) => {
    return source.hasOwnProperty('deviceList') && source.hasOwnProperty('wsn');
  };
  const formLayout = useLocaleFormLayout(18, 'vertical');
  const isGatewayBle = network?.devices?.[0]?.type === DeviceType.Gateway;

  const onBeforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const json = JSON.parse(reader.result);
        if (checkJSONFormat(json)) {
          setNetwork({ wsn: json.wsn, devices: json.deviceList });
        } else {
          message.error(intl.get('INVALID_FILE_FORMAT')).then();
        }
      }
    };
    return false;
  };

  const onSave = () => {
    if (network === undefined) {
      message.error(intl.get('PLEASE_UPLOAD_FILE'));
      return;
    }
    const nodes = network.devices;
    if (nodes && nodes.length && provisionMode) {
      form.validateFields().then((values) => {
        const req: NetworkRequestForm = {
          mode: provisionMode,
          wsn: values.wsn ?? network.wsn,
          devices: nodes.map((n: any) => {
            return {
              name: n.name,
              mac_address: n.address,
              parent_address: n.parentAddress,
              type_id: n.type,
              settings: n.settings
            };
          })
        };
        ImportNetworkRequest(req).then((_) => {
          setSuccess(true);
          devicesContext.refresh(true);
        });
      });
    } else {
      message.error(intl.get('DO_NOT_IMPORT_EMPTY_NETWORK')).then();
    }
  };

  useEffect(() => {
    setNetworkSettings(
      network?.wsn
        ? ({
            mode: network.wsn.provisioning_mode,
            communicationPeriod: network.wsn.communication_period,
            communicationPeriod2: network.wsn.communication_period_2,
            communicationOffset: network.wsn.communication_offset,
            groupSize: network.wsn.group_size
          } as Network)
        : undefined
    );
  }, [network]);

  useEffect(() => {
    if (network !== undefined) {
      form.setFieldsValue({
        name: network.name
      });
      setProvisionMode(network.wsn.provisioning_mode === 0 ? 1 : network.wsn.provisioning_mode);
    }
  }, [network, form, setProvisionMode]);

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [form, settings]);

  const renderAction = () => {
    if (network) {
      return (
        <a
          onClick={() => {
            setNetwork(undefined);
            form.resetFields();
          }}
        >
          {intl.get('RESET')}
        </a>
      );
    }
    return <div />;
  };

  return (
    <Grid>
      <Col span={24}>
        <Card styles={{ body: { paddingBlock: 8 } }}>
          <Flex justify='space-between' align='center'>
            <Breadcrumb
              items={[
                { title: <SelfLink to='/devices/0'>{VIRTUAL_ROOT_DEVICE.name}</SelfLink> },
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
          <Grid>
            <Col flex='auto'>
              {network?.devices.length ? (
                <Preview
                  devices={network.devices}
                  extra={renderAction()}
                  title={intl.get('PREVIEW')}
                />
              ) : (
                <Card>
                  <Dragger accept={'.json'} beforeUpload={onBeforeUpload} showUploadList={false}>
                    <p className='ant-upload-drag-icon'>
                      <InboxOutlined />
                    </p>
                    <p className='ant-upload-text'>{intl.get('UPLOAD_NETWORK_PROMPT')}</p>
                    <p className='ant-upload-hint'>{intl.get('UPLOAD_NETWORK_HINT')}</p>
                  </Dragger>
                </Card>
              )}
            </Col>
            {isGatewayBle && (
              <Col flex='300px'>
                <Card type='inner' size={'small'} title={intl.get('EDIT')}>
                  <Form form={form} {...formLayout} labelWrap={true}>
                    {network && provisionMode && (
                      <WsnFormItem mode={provisionMode} onModeChange={setProvisionMode} />
                    )}
                  </Form>
                </Card>
              </Col>
            )}
          </Grid>
        )}
        {success && (
          <Result
            status='success'
            title={intl.get('NETWORK_IMPORTED_SUCCESSFUL')}
            subTitle={intl.get('NETWORK_IMPORTED_NEXT_PROMPT')}
            extra={[
              <Button type='primary' key='devices' onClick={() => navigate('/networks')}>
                {intl.get('BACK_TO_NETWORKS')}
              </Button>,
              <Button
                key='add'
                onClick={() => {
                  form.resetFields();
                  setNetwork({ devices: [], wsn: {} });
                  setSuccess(false);
                }}
              >
                {intl.get('CONTINUE_TO_IMPORT_NETWORK')}
              </Button>
            ]}
          />
        )}
      </Col>
    </Grid>
  );
};

export default ImportNetworkPage;
