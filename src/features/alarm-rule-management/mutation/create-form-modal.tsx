import * as React from 'react';
import { Form, ModalProps } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { IconButton } from 'components';
import { ModalWrapper } from 'components/modalWrapper';
import * as AlarmLevel from 'domains/alarm-level';
import { ActionModalContext, createSubmitHandler } from 'resource';
import { CreateData } from 'domains/alarm-rule';
import { useSelectMonitoringPointType } from './use-select-monitoring-point-type';
import { GroupFormItems } from '../form-items/group';
import { EditTable } from '../form-items/edit-table';
import { NameFormItem } from '../form-items/name';
import { MetricFormItem } from '../form-items/metric';
import { DurationFormItem } from '../form-items/duration';
import { ConditionFormItem } from '../form-items/trigger-condition';
import { AlarmLevelsFormItem } from '../form-items/levels-select';

// ---------- 表单默认值 ----------
const defaultRule = {
  duration: 1,
  operation: '>=',
  level: AlarmLevel.Enum.Critical
};

export const CreateFormModal = ({
  loading,
  submit,
  close,
  ...rest
}: ModalProps & ActionModalContext<any, CreateData>) => {
  const [form] = Form.useForm<CreateData>();
  const [unit, setUnit] = React.useState<string>();
  const { properties, ...monitoringPointSelectProps } = useSelectMonitoringPointType(form, setUnit);

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      confirmLoading={loading}
      onCancel={close}
      onOk={() =>
        form
          .validateFields()
          .then(createSubmitHandler((values) => submit({ ...values, properties }), close))
      }
      title={intl.get('CREATE_ALARM_RULE')}
      width={860}
    >
      <Form form={form} layout='vertical'>
        <GroupFormItems {...monitoringPointSelectProps} />
        <Form.List name='rules' initialValue={[defaultRule]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              <EditTable
                {...{
                  fields,
                  onRemove: remove,
                  renderNameFormItem: (index: number) => <NameFormItem nameIndex={index} />,
                  renderIndexFormItem: (index: number) => (
                    <MetricFormItem nameIndex={index} onChange={setUnit} properties={properties} />
                  ),
                  renderDurationFormItem: (index: number) => <DurationFormItem nameIndex={index} />,
                  renderConditionFormItem: (index: number) => (
                    <ConditionFormItem nameIndex={index} unit={unit} />
                  ),
                  renderSeverityFormItem: (index: number) => (
                    <AlarmLevelsFormItem nameIndex={index} />
                  )
                }}
                footer={() => (
                  <IconButton
                    icon={<PlusCircleOutlined />}
                    size='small'
                    onClick={() => add(defaultRule)}
                  />
                )}
              />
              <Form.ErrorList errors={errors} />
            </>
          )}
        </Form.List>
      </Form>
    </ModalWrapper>
  );
};
