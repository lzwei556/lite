import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Button, Col, Form, Result } from 'antd';
import intl from 'react-intl-universal';
import { Card, Grid, Link, SaveIconButton, TitleExtraLayout } from '../../../components';
import * as WSN from '../../../wsn';
import { VIRTUAL_ROOT_DEVICE } from '../virtual';
import * as Basis from '../basis-form-items';
import { isBLEGateway, SettingsFormItems } from '../settings-common';
import { useContext } from '..';
import { DeviceNavigator } from '../navigator';
import { useProps2 } from './hooks';

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

  const id = Number(pathname.split('/')[2]);

  return (
    <Grid>
      <Col span={24}>
        <TitleExtraLayout
          title={
            device && device.id === id ? (
              <DeviceNavigator
                device={device}
                suffix={{ title: intl.get('CREATE_SOMETHING', { something: intl.get('DEVICE') }) }}
              />
            ) : (
              <Breadcrumb
                items={[
                  { title: <Link to='/devices/0'>{VIRTUAL_ROOT_DEVICE.name}</Link> },
                  { title: intl.get('CREATE_SOMETHING', { something: intl.get('DEVICE') }) }
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
