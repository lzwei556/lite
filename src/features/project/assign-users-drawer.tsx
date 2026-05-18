import { Checkbox, Col, Drawer, DrawerProps, Form, Spin } from 'antd';
import { ActionModalContext } from 'common/action';
import { CheckboxFormItem, Grid, MutedCard, SaveIconButton } from 'components';
import { Fields, getAssignedUsers, Project, UserAssignmentData } from 'domain/project';
import { createSubmitHandler, useList } from 'hooks/data';
import React from 'react';
import intl from 'react-intl-universal';

export const AssignUsersDrawer = ({
  close,
  record: project,
  loading,
  submit,
  ...rest
}: DrawerProps & ActionModalContext<Project, UserAssignmentData>) => {
  const [form] = Form.useForm<Omit<UserAssignmentData, 'id'>>();
  const list = useList(getAssignedUsers, { defaultParams: { id: project?.id ?? 0 } });
  const userOptions = (list.data ?? []).map((u) => ({ label: u.user.username, value: u.user.id }));
  const oldUserIds = (list.data ?? []).filter((u) => u.isAllocated).map((u) => u.user.id);

  return (
    <Drawer
      {...rest}
      extra={
        <SaveIconButton
          loading={loading}
          onClick={() =>
            form
              .validateFields()
              .then(
                createSubmitHandler(
                  project ? (values) => submit({ id: project.id, ...values }) : undefined,
                  close
                )
              )
          }
          size='small'
        />
      }
      onClose={close}
      placement='right'
      title={project?.name}
    >
      <Spin spinning={list.loading}>
        {!list.loading && (
          <Form form={form} initialValues={{ [Fields.UserIds.name]: oldUserIds }}>
            <MutedCard title={intl.get('USER_LIST')}>
              <CheckboxFormItem
                name={Fields.UserIds.name}
                rules={Fields.UserIds.rules}
                checkboxGroupProps={{
                  children: (
                    <Grid>
                      {userOptions.map((opt) => (
                        <Col key={opt.value} span={12}>
                          <Checkbox value={opt.value}>{opt.label}</Checkbox>
                        </Col>
                      ))}
                    </Grid>
                  )
                }}
              />
            </MutedCard>
          </Form>
        )}
      </Spin>
    </Drawer>
  );
};
