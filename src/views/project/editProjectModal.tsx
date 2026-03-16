import React from 'react';
import { Form, Input } from 'antd';
import { Translation } from 'locales/utils';
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
      title={Translation.doSth(`common.action.${project ? 'edit' : 'create'}`, 'project')}
      okText={Translation.get(`common.action.${project ? 'save' : 'create'}`)}
      onOk={handleOK}
      confirmLoading={isLoading}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...project,
          type: project?.type ?? ProjectType.Condition,
          description: project?.description ?? ''
        }}
      >
        <TextFormItem
          label='common.name'
          name='name'
          rules={[{ required: true }, { min: 4, max: 32 }]}
        />
        <TextFormItem label='common.description' name='description'>
          <Input.TextArea />
        </TextFormItem>
        {appConfig === 'general' && (
          <SelectFormItem
            label='common.type'
            name='type'
            selectProps={{
              disabled: !!project,
              options: projectTypeOptions.map((o) => ({ ...o, label: Translation.get(o.label) }))
            }}
          />
        )}
      </Form>
    </ModalWrapper>
  );
};
