import React from 'react';
import { Form, Input } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../types/common';
import { Project } from '../../types/project';
import { ModalWrapper } from '../../components/modalWrapper';
import { SelectFormItem, TextFormItem } from '../../components';
import { ProjectType, useProjectTypeOptions } from '../../project';
import { CreateProjectRequest, UpdateProjectRequest } from '../../apis/project';
import { useAppConfig } from '../../config';

export const EditProjectModal = ({
  project,
  onSuccess,
  ...rest
}: ModalFormProps & { project?: Project }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [form] = Form.useForm();
  const appConfig = useAppConfig();
  const projectTypeOptions = useProjectTypeOptions();

  const handleOK = () => {
    form.validateFields().then((values) => {
      setIsLoading(true);
      if (project) {
        UpdateProjectRequest(project.id, values)
          .then(onSuccess)
          .finally(() => setIsLoading(false));
      } else {
        CreateProjectRequest(values)
          .then(onSuccess)
          .finally(() => setIsLoading(false));
      }
    });
  };

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      title={project ? intl.get('EDIT_PROJECT') : intl.get('CREATE_PROJECT')}
      okText={project ? intl.get('SAVE') : intl.get('CREATE')}
      onOk={handleOK}
      confirmLoading={isLoading}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...project,
          type: project?.type ?? ProjectType.ConditionMonitoring,
          description: project?.description ?? ''
        }}
      >
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 32 }]} />
        <TextFormItem label='DESCRIPTION' name='description'>
          <Input.TextArea />
        </TextFormItem>
        {appConfig === 'general' && (
          <SelectFormItem
            label='TYPE'
            name='type'
            selectProps={{
              disabled: !!project,
              options: projectTypeOptions.map((o) => ({ ...o, label: intl.get(o.label) }))
            }}
          />
        )}
      </Form>
    </ModalWrapper>
  );
};
