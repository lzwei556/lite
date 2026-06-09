import * as React from 'react';
import { Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from 'utils/grid';
import { ModalWrapper } from 'components/modalWrapper';
import { ModalFormProps } from 'types/common';
import { Grid, SelectFormItem, Table, TextFormItem } from 'components';
import { AlarmRule, translateMetricName, update } from 'domains/alarm-rule';
import { ActionModalContext, createSubmitHandler } from 'resource';
import { NameFormItem } from '../form-items/name';
import { DurationFormItem } from '../form-items/duration';
import { ConditionFormItem } from '../form-items/trigger-condition';
import { AlarmLevelsFormItem } from '../form-items/levels-select';
import { MetricFormItem } from '../form-items/metric';
import { useAppConfig } from 'providers/app';
import { getRuleColumns } from './rule-columns';

export const UpdateModal = (
  props: ModalFormProps & { alarm: AlarmRule } & ActionModalContext<AlarmRule, any>
) => {
  const { alarm, ...rest } = props;
  const monitoringPointTypeOptions = useAppConfig().monitoringPointTypeOptions;
  const [form] = Form.useForm();

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      okText={intl.get('SAVE')}
      onOk={() => {
        form.validateFields().then((values: AlarmRule) => {
          const final = {
            ...values,
            category: 2,
            rules: alarm.rules.map((_rule: any) => ({
              ..._rule,
              threshold: Number(_rule.threshold),
              description: _rule.description || ''
            }))
          };
          if (props.submit) {
            createSubmitHandler(props.submit, props.close)({ id: alarm.id, data: final } as any);
          } else {
            update({ id: alarm.id, data: final }).then(() => props.onSuccess && props.onSuccess());
          }
        });
      }}
      title={intl.get('EDIT_ALARM_RULE')}
      width={860}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...alarm,
          rules: alarm.rules.map((r) => ({
            ...r,
            index: translateMetricName(r.metric.name)
          }))
        }}
      >
        <Grid>
          <Col {...generateColProps({ xl: 12, xxl: 12 })}>
            <TextFormItem
              label='NAME'
              name='name'
              rules={[{ required: true }, { min: 4, max: 16 }]}
            />
          </Col>
          <Col {...generateColProps({ xl: 12, xxl: 12 })}>
            <SelectFormItem
              label='monitoring.point.type'
              name='type'
              rules={[{ required: true }]}
              selectProps={{ disabled: true, options: monitoringPointTypeOptions }}
            />
          </Col>
        </Grid>
        <Grid>
          <Col {...generateColProps({})}>
            <TextFormItem label='DESCRIPTION' name='description' initialValue='' />
          </Col>
        </Grid>
        <Form.List name='rules'>
          {(fields, _, { errors }) => {
            return (
              <>
                <Table
                  cardProps={{ style: { marginBottom: 16 } }}
                  columns={getRuleColumns({
                    renderNameFormItem: (index) => <NameFormItem nameIndex={index} />,
                    renderIndexFormItem: (index) => (
                      <MetricFormItem disabled={true} nameIndex={index} properties={[]} />
                    ),
                    renderDurationFormItem: (index) => <DurationFormItem nameIndex={index} />,
                    renderConditionFormItem: (index) => <ConditionFormItem nameIndex={index} />,
                    renderSeverityFormItem: (index) => <AlarmLevelsFormItem nameIndex={index} />
                  })}
                  dataSource={fields}
                  header={{ title: intl.get('sub.rules') }}
                  noScroll={true}
                  pagination={false}
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
