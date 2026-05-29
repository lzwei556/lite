import React from 'react';
import { Col, Form, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import intl from 'react-intl-universal';
import {
  createActionState,
  createSubmitHandler,
  useActionController,
  useDataFetch
} from 'resource';
import {
  EditIconButton,
  Grid,
  InlineEditFormItem,
  MutedCard,
  TextFormItem,
  Descriptions
} from 'components';
import { useGetIdentity, useUpdatePassword } from 'providers/auth';
import { UpdatePasswordModal } from 'features/auth';
import { updateProfile } from 'domain/profile';
import { Fields } from 'domain/user';

export default function Me() {
  const [phoneForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const user = useGetIdentity();
  const updateProfileStatus = createActionState(
    useDataFetch(updateProfile, {
      manual: true,
      onSuccess: ({ messageInstance }) => messageInstance?.success('save.success')
    })
  );
  const updatePasswordState = createActionState(useUpdatePassword());

  const actionConfig = React.useMemo(
    () => ({
      updatePassword: {
        modal: (ctx: any) => <UpdatePasswordModal {...ctx} />,
        state: updatePasswordState
      }
    }),
    [updatePasswordState]
  );

  const { open, modalNode } = useActionController({ actions: actionConfig });

  const renderItem = (label: string, content: React.ReactNode) => {
    return (
      <Descriptions
        items={[{ label, children: content }]}
        style={{ marginBlock: 8, height: 32, lineHeight: '32px' }}
        styles={{ label: { minWidth: 160 }, content: { justifyContent: 'flex-start' } }}
      />
    );
  };

  return (
    <Content>
      <Typography.Title level={4}>{intl.get('MENU_USER_CENTER')}</Typography.Title>
      <Grid>
        <Col span={24}>
          <MutedCard title={intl.get('BASIC_INFORMATION')}>
            {renderItem(intl.get('ACCOUNT_NAME'), user?.username)}
            {renderItem(
              intl.get(Fields.Phone.label),
              user && (
                <Form form={phoneForm} initialValues={{ phone: user.phone }}>
                  <InlineEditFormItem
                    loading={updateProfileStatus.loading}
                    value={user.phone}
                    onSave={() =>
                      phoneForm
                        .validateFields()
                        .then(createSubmitHandler(updateProfileStatus.submit))
                    }
                    onCancel={() => phoneForm.resetFields()}
                  >
                    <TextFormItem name='phone' noStyle rules={Fields.Phone.rules} />
                  </InlineEditFormItem>
                </Form>
              )
            )}
            {renderItem(
              intl.get(Fields.Email.label),
              user && (
                <Form form={emailForm} initialValues={{ email: user.email }}>
                  <InlineEditFormItem
                    loading={updateProfileStatus.loading}
                    value={user.email}
                    onSave={() =>
                      emailForm
                        .validateFields()
                        .then(createSubmitHandler(updateProfileStatus.submit))
                    }
                    onCancel={() => emailForm.resetFields()}
                  >
                    <TextFormItem name='email' noStyle rules={Fields.Email.rules} />
                  </InlineEditFormItem>
                </Form>
              )
            )}
          </MutedCard>
        </Col>
        <Col span={24}>
          <MutedCard title={intl.get('ACCOUNT_SECURITY')}>
            {renderItem(
              intl.get('PASSWORD'),
              <Space>
                ****************
                <EditIconButton
                  color='primary'
                  onClick={() => open('updatePassword')}
                  size='small'
                  variant='text'
                />
              </Space>
            )}
          </MutedCard>
        </Col>
        {modalNode}
      </Grid>
    </Content>
  );
}
