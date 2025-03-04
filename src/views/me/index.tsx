import { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Space } from 'antd';
import intl from 'react-intl-universal';
import { GetMyProfile, UpdateMyProfile } from '../../apis/profile';
import { User } from '../../types/user';
import { Card, Grid } from '../../components';
import EditPassModal from './edit/editPassModal';

const MePage = () => {
  const [isPhoneEdit, setIsPhoneEdit] = useState<boolean>(false);
  const [isEmailEdit, setIsEmailEdit] = useState<boolean>(false);
  const [isPassEdit, setIsPassEdit] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [form] = Form.useForm();

  useEffect(() => {
    GetMyProfile().then(setUser);
  }, []);

  const renderPhone = () => {
    const render = () => {
      if (isPhoneEdit) {
        return <Input />;
      } else {
        return (
          <span style={{ lineHeight: '32px' }}>
            {user && user.phone.length ? user.phone : intl.get('NOT_BOUND_PROMPT')}
          </span>
        );
      }
    };

    return (
      <Form.Item
        label={intl.get('CELLPHONE')}
        name='phone'
        initialValue={user?.phone}
        style={{ marginBottom: 16 }}
      >
        <Space>
          <Space.Compact>
            {render()}
            {isPhoneEdit ? (
              <Button onClick={onSavePhone} type='link'>
                {intl.get('SAVE')}
              </Button>
            ) : (
              <Button onClick={() => setIsPhoneEdit(true)} type='link'>
                {intl.get('MODIFY')}
              </Button>
            )}
          </Space.Compact>
        </Space>
      </Form.Item>
    );
  };

  const onSavePhone = () => {
    form.validateFields(['phone']).then((values) => {
      UpdateMyProfile({ phone: values.phone }).then((res) => {
        if (res.code === 200) {
          message.success(intl.get('SAVED_SUCCESSFUL')).then();
          setUser(res.data);
        } else {
          message.error(intl.get('FAILED_TO_SAVE')).then();
        }
        setIsPhoneEdit(false);
      });
    });
  };

  const renderEmail = () => {
    const render = () => {
      if (isEmailEdit) {
        return <Input />;
      } else {
        return (
          <span style={{ lineHeight: '32px' }}>
            {user && user.email.length ? user.email : intl.get('NOT_BOUND_PROMPT')}
          </span>
        );
      }
    };

    return (
      <Form.Item
        label={intl.get('EMAIL')}
        name='email'
        initialValue={user?.email}
        rules={[{ type: 'email' }]}
        style={{ marginBottom: 16 }}
      >
        <Space>
          <Space.Compact>
            {render()}
            {isEmailEdit ? (
              <Button onClick={onSaveEmail} type='link'>
                {intl.get('SAVE')}
              </Button>
            ) : (
              <Button onClick={() => setIsEmailEdit(true)} type='link'>
                {intl.get('MODIFY')}
              </Button>
            )}
          </Space.Compact>
        </Space>
      </Form.Item>
    );
  };

  const onSaveEmail = () => {
    form.validateFields(['email']).then((values) => {
      UpdateMyProfile({ email: values.email }).then((res) => {
        if (res.code === 200) {
          message.success(intl.get('SAVED_SUCCESSFUL')).then();
          setUser(res.data);
        } else {
          message.error(intl.get('FAILED_TO_SAVE')).then();
        }
        setIsEmailEdit(false);
      });
    });
  };

  return (
    <Grid>
      <Col span={24}>
        <Card title={intl.get('BASIC_INFORMATION')} bordered={false}>
          <Form form={form} labelAlign='left' labelCol={{ span: 2 }} wrapperCol={{ span: 8 }}>
            <Form.Item label={intl.get('ACCOUNT_NAME')} style={{ marginBottom: 16 }}>
              {user?.username}
            </Form.Item>
            {renderPhone()}
            {renderEmail()}
          </Form>
        </Card>
      </Col>
      <Col span={24}>
        <Card title={intl.get('ACCOUNT_SECURITY')} bordered={false}>
          <Form.Item label={intl.get('PASSWORD')} labelAlign='left' labelCol={{ span: 2 }}>
            <Space>
              <Space.Compact>
                <span style={{ lineHeight: '32px' }}>****************</span>
                <Button onClick={() => setIsPassEdit(true)} type='link'>
                  {intl.get('MODIFY')}
                </Button>
              </Space.Compact>
            </Space>
          </Form.Item>
        </Card>
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
  );
};

export default MePage;
