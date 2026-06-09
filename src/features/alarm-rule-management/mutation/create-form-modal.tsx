import * as React from 'react';
import { Col, Form, ModalProps } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { FormItem, Grid, IconButton, Table } from 'components';
import { generateColProps } from 'utils/grid';
import { ModalWrapper } from 'components/modalWrapper';
import * as AlarmLevel from 'domains/alarm-level';
import { ActionModalContext, createSubmitHandler } from 'resource';
import { AlarmRuleGroupFields, CreateData } from 'domains/alarm-rule';
import { useSelectMonitoringPointType } from './use-select-monitoring-point-type';
import { getRuleColumns } from './rule-columns';
import { NameFormItem } from '../form-items/name';
import { MetricFormItem } from '../form-items/metric';
import { DurationFormItem } from '../form-items/duration';
import { ConditionFormItem } from '../form-items/trigger-condition';
import { AlarmLevelsFormItem } from '../form-items/levels-select';
import { toUniversalFormItemProps } from 'types';

// ---------- 表单默认值 ----------
const defaultRule = {
  duration: 1,
  operation: '>=',
  level: AlarmLevel.Enum.Critical
};

export function CreateModal({
  loading,
  submit,
  close,
  ...rest
}: ModalProps & ActionModalContext<any, CreateData>) {
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
        <Grid>
          <Col {...generateColProps({ xl: 12, xxl: 12 })}>
            <FormItem {...toUniversalFormItemProps({ field: AlarmRuleGroupFields.Name })} />
          </Col>
          <Col {...generateColProps({ xl: 12, xxl: 12 })}>
            <FormItem
              {...toUniversalFormItemProps({ field: AlarmRuleGroupFields.Type })}
              selectProps={monitoringPointSelectProps}
            />
          </Col>
          <Col {...generateColProps({})}>
            <FormItem {...toUniversalFormItemProps({ field: AlarmRuleGroupFields.Description })} />
          </Col>
        </Grid>
        <Form.List name='rules' initialValue={[defaultRule]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              <Table
                cardProps={{ style: { marginBottom: 16 } }}
                columns={getRuleColumns({
                  onRemove: remove,
                  renderNameFormItem: (index) => <NameFormItem nameIndex={index} />,
                  renderIndexFormItem: (index) => (
                    <MetricFormItem nameIndex={index} onChange={setUnit} properties={properties} />
                  ),
                  renderDurationFormItem: (index) => <DurationFormItem nameIndex={index} />,
                  renderConditionFormItem: (index) => (
                    <ConditionFormItem nameIndex={index} unit={unit} />
                  ),
                  renderSeverityFormItem: (index) => <AlarmLevelsFormItem nameIndex={index} />
                })}
                dataSource={fields}
                footer={() => (
                  <IconButton
                    icon={<PlusCircleOutlined />}
                    size='small'
                    onClick={() => add(defaultRule)}
                  />
                )}
                header={{ title: intl.get('sub.rules') }}
                noScroll
                pagination={false}
              />
              <Form.ErrorList errors={errors} />
            </>
          )}
        </Form.List>
      </Form>
    </ModalWrapper>
  );
}
