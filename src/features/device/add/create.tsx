import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Col, Form, Result } from 'antd';
import { Card, Grid, Link, SaveIconButton, TitleExtraLayout } from '../../../components';
import * as WSN from '../../../wsn';
import { useVirtualRootDevice } from '../virtual';
import * as Basis from '../basis-form-items';
import { isBLEGateway, SettingsFormItems } from '../settings-common';
import { useContext } from '..';
import { DeviceNavigator } from '../navigator';
import { useProps2 } from './hooks';
import { Translation } from 'locales/utils';

export default function Create() {
  return (
    <Basis.ContextProvier>
      <CreateForm />
    </Basis.ContextProvier>
  );
}

const CreateForm = () => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const {
    handleSubmit,
    success,
    result,
    continueButtonProps,
    closeButtonProps,
    formProps,
    deviceType,
    basis,
    settings,
    wsn
  } = useProps2(() => {
    if (state && state.from) {
      navigate(state.from);
    }
  });
  const { device } = useContext();
  const rootDevice = useVirtualRootDevice();
  const id = Number(pathname.split('/')[2]);

  return (
    <Grid>
      <Col span={24}>
        <TitleExtraLayout
          title={
            device && device.id === id ? (
              <DeviceNavigator
                device={device}
                suffix={{ title: Translation.createSth('device') }}
              />
            ) : (
              <Breadcrumb
                items={[
                  { title: <Link to='/devices/0'>{rootDevice.name}</Link> },
                  { title: Translation.createSth('device') }
                ]}
              />
            )
          }
          extra={
            <SaveIconButton
              color='primary'
              onClick={() => formProps.form?.validateFields().then(handleSubmit)}
              size='middle'
              variant='solid'
            />
          }
          paddingBlock={14}
        />
      </Col>
      <Col span={24}>
        {success && (
          <Card>
            <Result
              {...result}
              extra={[
                <Button key='continue' {...continueButtonProps} />,
                <Button key='close' {...closeButtonProps} />
              ]}
            />
          </Card>
        )}
        {!success && (
          <Form {...formProps}>
            <Card {...basis.cardProps}>
              <Basis.FormItems {...basis.formItemsProps} />
            </Card>
            {deviceType && (
              <>
                <SettingsFormItems {...settings} key={deviceType} />
                {isBLEGateway(deviceType) && (
                  <Card {...wsn.cardProps}>
                    <WSN.FormItems {...wsn.formItemsProps} />
                  </Card>
                )}
              </>
            )}
          </Form>
        )}
      </Col>
    </Grid>
  );
};
