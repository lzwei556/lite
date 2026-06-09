import * as React from 'react';
import { Form, ModalProps } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from 'components/modalWrapper';
import { AlarmRule, parseMetric, UpdateData } from 'domains/alarm-rule';
import { ActionModalContext, createSubmitHandler } from 'resource';
import { useSelectMonitoringPointType } from './use-select-monitoring-point-type';
import { GroupFormItems } from '../form-items/group';
import { EditTable } from '../form-items/edit-table';
import { NameFormItem } from '../form-items/name';
import { DurationFormItem } from '../form-items/duration';
import { ConditionFormItem } from '../form-items/trigger-condition';
import { AlarmLevelsFormItem } from '../form-items/levels-select';
import { MetricFormItem } from '../form-items/metric';

export const UpdateFormModal = (props: ModalProps & ActionModalContext<AlarmRule, UpdateData>) => {
  const { record: rule, loading, submit, close, ...rest } = props;
  const [form] = Form.useForm<UpdateData>();
  const { properties, ...monitoringPointSelectProps } = useSelectMonitoringPointType(form);

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      onCancel={close}
      okText={intl.get('SAVE')}
      onOk={() => {
        form
          .validateFields()
          .then(createSubmitHandler((values) => submit({ ...values, properties }), close));
      }}
      title={intl.get('EDIT_ALARM_RULE')}
      width={860}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...rule,
          rules: rule?.rules.map((r) => ({
            ...r,
            metric: parseMetric(r.metric)
          }))
        }}
      >
        <GroupFormItems {...{ ...monitoringPointSelectProps, disabled: true }} />
        <Form.List name='rules'>
          {(fields, _, { errors }) => {
            return (
              <>
                <EditTable
                  {...{
                    fields,
                    renderNameFormItem: (index) => <NameFormItem nameIndex={index} />,
                    renderIndexFormItem: (index) => (
                      <MetricFormItem disabled={true} nameIndex={index} />
                    ),
                    renderDurationFormItem: (index) => <DurationFormItem nameIndex={index} />,
                    renderConditionFormItem: (index) => (
                      <ConditionFormItem
                        nameIndex={index}
                        unit={rule?.rules?.[index]?.metric.unit}
                      />
                    ),
                    renderSeverityFormItem: (index) => <AlarmLevelsFormItem nameIndex={index} />
                  }}
                />
                <Form.ErrorList errors={errors} />
              </>
            );
          }}
        </Form.List>
      </Form>
    </ModalWrapper>
  );
};
