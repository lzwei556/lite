import * as React from 'react';
import { Col, Form, FormListFieldData } from 'antd';
import { Translation } from 'locales/utils';
import { App, useAppType } from '../../../config';
import { generateColProps } from '../../../utils/grid';
import { ModalWrapper } from '../../../components/modalWrapper';
import { ModalFormProps } from '../../../types/common';
import { Grid, SelectFormItem, Table, TextFormItem } from '../../../components';
import { AlarmRule } from './types';
import { NameFormItem } from './nameFormItem';
import { DurationFormItem } from './durationFormItem';
import { ConditionFormItem } from './conditionFormItem';
import { SeverityFormItem } from './severityFormItem';
import { IndexFormItem } from './indexFormItem';
import { updateAlarmRule } from './services';
import { translateMetricName } from '.';

export function UpdateModal(props: ModalFormProps & { alarm: AlarmRule }) {
  const { alarm, ...rest } = props;
  const appType = useAppType();
  const [form] = Form.useForm();

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      okText={Translation.get('common.action.save')}
      onOk={() => {
        form.validateFields().then((values: AlarmRule) => {
          const final = {
            ...values,
            category: 2,
            rules: values.rules.map((_rule) => ({
              ..._rule,
              threshold: Number(_rule.threshold),
              description: _rule.description || ''
            }))
          };
          updateAlarmRule(alarm.id, final).then(props.onSuccess);
        });
      }}
      title={Translation.editSth('alarm.rules')}
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
              label='common.name'
              name='name'
              rules={[{ required: true }, { min: 4, max: 16 }]}
            />
          </Col>
          <Col {...generateColProps({ xl: 12, xxl: 12 })}>
            <SelectFormItem
              label='monitoring.point.type'
              name='type'
              rules={[{ required: true }]}
              selectProps={{
                disabled: true,
                options: App.getMonitoringPointTypes(appType).map(({ label, value }) => ({
                  label: Translation.get(label),
                  value
                }))
              }}
            />
          </Col>
        </Grid>
        <Grid>
          <Col {...generateColProps({})}>
            <TextFormItem label='common.description' name='description' initialValue='' />
          </Col>
        </Grid>
        <Form.List name='rules'>
          {(fields, _, { errors }) => {
            return (
              <>
                <Table
                  cardProps={{ style: { marginBottom: 16 } }}
                  columns={[
                    {
                      key: 'name',
                      title: Translation.get('common.name'),
                      width: 120,
                      render: (_, row: FormListFieldData) => (
                        <NameFormItem disabled={true} nameIndex={row.name} />
                      )
                    },
                    {
                      key: 'property',
                      title: Translation.get('alarm.metric'),
                      width: 150,
                      render: (_, row: FormListFieldData) => (
                        <IndexFormItem disabled={true} nameIndex={row.name} properties={[]} />
                      )
                    },
                    {
                      key: 'duration',
                      title: Translation.get('alarm.consecutive.count'),
                      width: 60,
                      render: (_, row: FormListFieldData) => (
                        <DurationFormItem nameIndex={row.name} />
                      )
                    },
                    {
                      key: 'condition',
                      title: Translation.get('alarm.trigger.condition'),
                      width: 180,
                      render: (_, row: FormListFieldData, index: number) => {
                        return (
                          <ConditionFormItem
                            nameIndex={row.name}
                            unitText={alarm.rules[index]?.metric.unit}
                          />
                        );
                      }
                    },
                    {
                      key: 'severity',
                      title: Translation.get('alarm.level'),
                      width: 80,
                      render: (_, row: FormListFieldData) => (
                        <SeverityFormItem nameIndex={row.name} />
                      )
                    }
                  ]}
                  dataSource={fields}
                  header={{ title: Translation.get('alarm.sub-rules') }}
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
}
