import * as React from 'react';
import { Col, Form, FormListFieldData, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { getPropertiesByMeasurementType, updateAlarmRule } from './services';
import { AlarmRule } from './types';
import { FormInputItem } from '../../../components/formInputItem';
import { DisplayProperty } from '../../../constants/properties';
import { MONITORING_POINT, Point } from '../../asset-common';
import { App, useAppType } from '../../../config';
import { cloneDeep } from 'lodash';
import { Grid, Table } from '../../../components';
import { NameFormItem } from './nameFormItem';
import { DurationFormItem } from './durationFormItem';
import { ConditionFormItem } from './conditionFormItem';
import { SeverityFormItem } from './severityFormItem';
import { IndexFormItem } from './indexFormItem';
import { generateColProps } from '../../../utils/grid';
import { ModalWrapper } from '../../../components/modalWrapper';
import { ModalFormProps } from '../../../types/common';
import { translateMetricName } from '.';

export function UpdateModal(props: ModalFormProps & { alarm: AlarmRule }) {
  const { alarm, ...rest } = props;
  const appType = useAppType();
  const [form] = Form.useForm();
  const [properties, setProperties] = React.useState<DisplayProperty[]>([]);
  const [metric, setMetric] = React.useState<{ key: string; name: string; unit?: string }[]>([]);

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      okText={intl.get('SAVE')}
      onOk={() => {
        form.validateFields().then((values: AlarmRule) => {
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
          rules: alarm.rules.map((r, i) => ({
            ...r,
            index: translateMetricName(r.metric.name)
          }))
        }}
      >
        <Grid gutter={[0, 0]} justify='space-between'>
          <Col {...generateColProps({ xl: 11, xxl: 11 })}>
            <FormInputItem
              name='name'
              label={intl.get('NAME')}
              requiredMessage={intl.get('PLEASE_ENTER_NAME')}
              lengthLimit={{ min: 4, max: 16, label: intl.get('NAME').toLowerCase() }}
            >
              <Input placeholder={intl.get('PLEASE_ENTER_NAME')} />
            </FormInputItem>
          </Col>
          <Col {...generateColProps({ xl: 11, xxl: 11 })}>
            <Form.Item
              label={intl.get('OBJECT_TYPE', { object: intl.get(MONITORING_POINT) })}
              name='type'
              rules={[
                {
                  required: true,
                  message: intl.get('PLEASE_SELECT_SOMETHING', {
                    something: intl.get('OBJECT_TYPE', { object: intl.get(MONITORING_POINT) })
                  })
                }
              ]}
            >
              <Select
                disabled={true}
                placeholder={intl.get('PLEASE_SELECT_SOMETHING', {
                  something: intl.get('OBJECT_TYPE', { object: intl.get(MONITORING_POINT) })
                })}
                onChange={(e) => {
                  getPropertiesByMeasurementType(e).then((res) => {
                    const measurementType = App.getMonitoringPointTypes(appType).find(
                      ({ id }) => e === id
                    )?.id;
                    if (measurementType) {
                      setProperties(
                        removeDulpicateProperties(Point.getPropertiesByType(res, measurementType))
                      );
                    }
                  });
                  const formData: AlarmRule['rules'] = form.getFieldValue('rules');
                  if (formData && formData.length > 0) {
                    form.setFieldsValue({
                      rules: formData.map((field) => {
                        delete field.index;
                        return field;
                      })
                    });
                  }
                }}
              >
                {App.getMonitoringPointTypes(appType).map(({ label, id }) => (
                  <Select.Option key={id} value={id}>
                    {intl.get(label)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Grid>
        <Grid>
          <Col {...generateColProps({})}>
            <Form.Item label={intl.get('DESCRIPTION')} name='description' initialValue=''>
              <Input placeholder={intl.get('PLEASE_ENTER_DESCRIPTION')} />
            </Form.Item>
          </Col>
        </Grid>
        <Form.List name='rules'>
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                <Table
                  columns={[
                    {
                      key: 'name',
                      title: intl.get('NAME'),
                      width: 120,
                      render: (text: any, row: FormListFieldData) => (
                        <NameFormItem disabled={true} nameIndex={row.name} />
                      )
                    },
                    {
                      key: 'property',
                      title: intl.get('INDEX'),
                      width: 150,
                      render: (text: any, row: FormListFieldData) => (
                        <IndexFormItem
                          disabled={true}
                          nameIndex={row.name}
                          onChange={(metric) => {
                            setMetric((prev) => {
                              if (prev.length === 0) {
                                return [metric];
                              } else if (prev.length < row.name + 1) {
                                return [...prev, metric];
                              } else {
                                return prev.map((item, n) => {
                                  if (n === row.name) {
                                    return metric;
                                  } else {
                                    return item;
                                  }
                                });
                              }
                            });
                          }}
                          properties={properties}
                        />
                      )
                    },
                    {
                      key: 'duration',
                      title: intl.get('DURATION'),
                      width: 60,
                      render: (text: any, row: FormListFieldData) => (
                        <DurationFormItem nameIndex={row.name} />
                      )
                    },
                    {
                      key: 'condition',
                      title: intl.get('CONDITION'),
                      width: 180,
                      render: (text: any, row: FormListFieldData) => {
                        let unitText = '';
                        if (metric.length > 0 && metric[row.name] && metric[row.name].unit) {
                          const unit = metric[row.name].unit as string;
                          unitText = intl.get(unit).d(unit);
                        }
                        return <ConditionFormItem nameIndex={row.name} unitText={unitText} />;
                      }
                    },
                    {
                      key: 'severity',
                      title: intl.get('SEVERITY'),
                      width: 80,
                      render: (text: any, row: FormListFieldData) => (
                        <SeverityFormItem nameIndex={row.name} />
                      )
                    }
                  ]}
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
}

function removeDulpicateProperties(properties: DisplayProperty[]) {
  const final = cloneDeep(properties);
  return final.map((property) => {
    const fields = property.fields;
    if (fields?.every((field) => field.key === property.key)) {
      return { ...property, fields: [] };
    } else {
      return property;
    }
  });
}
