import * as React from 'react';
import { Button, Col, Form, FormListFieldData, Input, Select } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { getPropertiesByMeasurementType } from './services';
import { AlarmRule } from './types';
import { addAlarmRule } from './services';
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

export function CreateModal(props: ModalFormProps) {
  const appType = useAppType();
  const [form] = Form.useForm();
  const [properties, setProperties] = React.useState<DisplayProperty[]>([]);
  const [metric, setMetric] = React.useState<{ key: string; name: string; unit?: string }[]>([]);

  return (
    <ModalWrapper
      {...props}
      afterClose={() => form.resetFields()}
      okText={intl.get('CREATE')}
      onOk={() => {
        form.validateFields().then((values: AlarmRule) => {
          const final = {
            ...values,
            category: 2,
            rules: values.rules.map((rule, index) => {
              delete rule.index;
              return {
                ...rule,
                duration: Number(rule.duration),
                threshold: Number(rule.threshold),
                metric: metric[index]
              };
            })
          };
          addAlarmRule(final).then(props.onSuccess);
        });
      }}
      title={intl.get('CREATE_ALARM_RULE')}
      width={860}
    >
      <Form form={form} layout='vertical'>
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
                        removeDulpicateProperties(
                          Point.getPropertiesByType(measurementType, res).map(
                            NormalizeAttitudeIndexProperty
                          )
                        )
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
        <Form.List name='rules' initialValue={[0]}>
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
                        <NameFormItem nameIndex={row.name} />
                      )
                    },
                    {
                      key: 'property',
                      title: intl.get('INDEX'),
                      width: 150,
                      render: (text: any, row: FormListFieldData) => (
                        <IndexFormItem
                          disabled={false}
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
                    },
                    {
                      key: 'operation',
                      title: intl.get('REMOVE'),
                      width: 60,
                      render: (text: any, row: FormListFieldData) => {
                        return (
                          <Button
                            disabled={row.name === 0}
                            icon={<MinusCircleOutlined />}
                            size='small'
                            type='text'
                            onClick={() => remove(row.name)}
                          />
                        );
                      }
                    }
                  ]}
                  dataSource={fields}
                  footer={() => (
                    <Button icon={<PlusCircleOutlined />} size='small' onClick={() => add()} />
                  )}
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

function NormalizeAttitudeIndexProperty(property: DisplayProperty) {
  const p = { ...property };
  return p.key === 'attitude' ? { ...p, key: p.fields?.[0]?.key ?? p.key } : p;
}
