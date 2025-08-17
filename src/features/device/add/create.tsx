import { useLocation } from 'react-router-dom';
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

export default function Create({ parentName }: { parentName?: string }) {
  return (
    <Basis.ContextProvier>
      <CreateForm />
    </Basis.ContextProvier>
  );
}

const CreateForm = ({ parentName }: { parentName?: string }) => {
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
  } = useProps2();
  const { device } = useContext();
  const { pathname } = useLocation();
  const id = Number(pathname.split('/')[2]);

  return (
    <Grid>
      <Col span={24}>
        <TitleExtraLayout
          title={
            <Breadcrumb
              items={[
                { title: <Link to='/devices/0'>{parentName ?? VIRTUAL_ROOT_DEVICE.name}</Link> },
                { title: intl.get('CREATE_SOMETHING', { something: intl.get('DEVICE') }) }
              ]}
            />
          }
          extra={
            <SaveIconButton color='primary' onClick={handleSubmit} size='middle' variant='solid' />
          }
          paddingBlock={14}
        />
      </Col>
      <Col span={24}>
        {success && (
          <Result
            {...result}
            extra={[
              <Button key='continue' {...continueButtonProps} />,
              <Button key='close' {...closeButtonProps} />
            ]}
          />
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
