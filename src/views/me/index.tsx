import React from 'react';
import { Col, Form, FormProps, message, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { GetMyProfile, UpdateMyProfile } from '../../apis/profile';
import { User } from '../../types/user';
import {
  EditIconButton,
  Flex,
  Grid,
  IconButton,
  MutedCard,
  SaveIconButton,
  TextFormItem
} from '../../components';
import { useGlobalStyles } from '../../styles';
import EditPassModal from './edit/editPassModal';

const MePage = () => {
  const [isPassEdit, setIsPassEdit] = React.useState(false);
  const [user, setUser] = React.useState<User>();
  const [phoneForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const { colorTextDescriptionStyle } = useGlobalStyles();
  React.useEffect(() => {
    GetMyProfile().then(setUser);
  }, []);

  const renderItem = (label: string, content: React.ReactNode) => {
    return (
      <Flex justify='flex-start' style={{ marginBlock: 8, height: 32, lineHeight: '32px' }}>
        <span style={{ minWidth: 160, ...colorTextDescriptionStyle }}>{label}</span>
        <Flex flex={1} justify='flex-start' align='center'>
          {content}
        </Flex>
      </Flex>
    );
  };

  return (
    <Content>
      <Typography.Title level={4}>{Translation.get('MENU_USER_CENTER')}</Typography.Title>
      <Grid>
        <Col span={24}>
          <MutedCard title={Translation.get('common.basic')}>
            {renderItem(Translation.get('auth.username'), user?.username)}
            {renderItem(
              Translation.get('common.mobile.phone'),
              user && (
                <ProfileItemForm
                  formProps={{ form: phoneForm, initialValues: { phone: user.phone } }}
                  input={
                    <TextFormItem
                      name='phone'
                      noStyle
                      rules={[{ pattern: /^1[3-9]\d{9}$/, message: 'feedback.invalid.phone' }]}
                    />
                  }
                  value={user.phone}
                  onSubmit={(values) =>
                    UpdateMyProfile(values).then((res) => {
                      if (res.code === 200) {
                        message.success(Translation.get('feedback.success.save')).then();
                        setUser(res.data);
                      } else {
                        message.error(Translation.failureDo('common.action.save'));
                      }
                    })
                  }
                />
              )
            )}
            {renderItem(
              Translation.get('common.email'),
              user && (
                <ProfileItemForm
                  formProps={{ form: emailForm, initialValues: { email: user.email } }}
                  input={
                    <TextFormItem
                      name='email'
                      noStyle
                      rules={[{ type: 'email', message: 'feedback.invalid.email' }]}
                    />
                  }
                  value={user.email}
                  onSubmit={(values) =>
                    UpdateMyProfile(values).then((res) => {
                      if (res.code === 200) {
                        message.success(Translation.get('feedback.success.save'));
                        setUser(res.data);
                      } else {
                        message.error(Translation.failureDo('common.action.save'));
                      }
                    })
                  }
                />
              )
            )}
          </MutedCard>
        </Col>
        <Col span={24}>
          <MutedCard title={Translation.get('label.me.account.security')}>
            {renderItem(
              Translation.get('auth.password'),
              <Space>
                ****************
                <EditIconButton
                  color='primary'
                  onClick={() => setIsPassEdit(true)}
                  size='small'
                  variant='text'
                />
              </Space>
            )}
          </MutedCard>
        </Col>
        <EditPassModal
          open={isPassEdit}
          onSuccess={() => {
            setIsPassEdit(false);
          }}
          onCancel={() => {
            setIsPassEdit(false);
          }}
        />
      </Grid>
    </Content>
  );
};

const ProfileItemForm = ({
  formProps,
  input,
  value,
  onSubmit
}: {
  formProps: FormProps;
  input: React.ReactNode;
  value?: string;
  onSubmit: (values: any) => Promise<void>;
}) => {
  const [editable, setEditable] = React.useState(false);

  return (
    <Form {...formProps}>
      <Space>
        {editable ? (
          <>
            {input}
            <div>
              <SaveIconButton
                icon={<CheckOutlined />}
                onClick={() =>
                  formProps?.form
                    ?.validateFields()
                    .then((values) => onSubmit(values).then(() => setEditable(false)))
                }
                variant='text'
              />
              <IconButton
                color='danger'
                icon={<CloseOutlined />}
                onClick={() => setEditable(false)}
                size='small'
                variant='text'
              />
            </div>
          </>
        ) : (
          <>
            {value && value.length > 0 ? value : Translation.get('common.unbinded')}
            <EditIconButton color='primary' onClick={() => setEditable(true)} variant='text' />
          </>
        )}
      </Space>
    </Form>
  );
};

export default MePage;
