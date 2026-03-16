import * as React from 'react';
import { Col, Form, FormListFieldData } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Translation } from 'locales/utils';
import { cloneDeep } from 'lodash';
import { Grid, IconButton, SelectFormItem, Table, TextFormItem } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import { ModalWrapper } from '../../../components/modalWrapper';
import { ModalFormProps } from '../../../types/common';
import { App, useAppType } from '../../../config';
import { AlarmLevel } from '../alarmLevel';
import { getPropertiesByMeasurementType } from './services';
import { AlarmRule } from './types';
import { addAlarmRule } from './services';
import { NameFormItem } from './nameFormItem';
import { DurationFormItem } from './durationFormItem';
import { ConditionFormItem } from './conditionFormItem';
import { SeverityFormItem } from './severityFormItem';
import { IndexFormItem } from './indexFormItem';
import { CharacteristicData, MonitoringPointType } from 'common';

export function CreateModal(props: ModalFormProps) {
  const appType = useAppType();
  const [form] = Form.useForm();
  const [properties, setProperties] = React.useState<CharacteristicData.DisplayProperty[]>([]);
  const [metric, setMetric] = React.useState<{ key: string; name: string; unit?: string }[]>([]);

  const defaultValues = { duration: 1, operation: '>=', level: AlarmLevel.Critical };

  return (
    <ModalWrapper
      {...props}
      afterClose={() => form.resetFields()}
      okText={Translation.get('common.action.create')}
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
      title={Translation.createSth('alarm.rules')}
      width={860}
    >
      <Form form={form} layout='vertical'>
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
                onChange: (e) => {
                  getPropertiesByMeasurementType(e).then((res) => {
                    const measurementType = App.getMonitoringPointTypes(appType).find(
                      ({ value }) => e === value
                    )?.value;
                    if (measurementType) {
                      setProperties(
                        removeDulpicateProperties(
                          MonitoringPointType.Key.getProperties(measurementType, res).map(
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
                },
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
        <Form.List name='rules' initialValue={[defaultValues]}>
          {(fields, { add, remove }, { errors }) => {
            return (
              <>
                <Table
                  cardProps={{ style: { marginBottom: 16 } }}
                  columns={[
                    {
                      key: 'name',
                      title: Translation.get('common.name'),
                      width: 120,
                      render: (_, row: FormListFieldData) => <NameFormItem nameIndex={row.name} />
                    },
                    {
                      key: 'property',
                      title: Translation.get('alarm.metric'),
                      width: 150,
                      render: (_, row: FormListFieldData) => (
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
                      render: (_, row: FormListFieldData) => {
                        let unitText = '';
                        if (metric.length > 0 && metric[row.name] && metric[row.name].unit) {
                          const unit = metric[row.name].unit as string;
                          unitText = Translation.get(unit);
                        }
                        return <ConditionFormItem nameIndex={row.name} unitText={unitText} />;
                      }
                    },
                    {
                      key: 'severity',
                      title: Translation.get('alarm.level'),
                      width: 80,
                      render: (_, row: FormListFieldData) => (
                        <SeverityFormItem nameIndex={row.name} />
                      )
                    },
                    {
                      key: 'operation',
                      title: Translation.get('common.action.remove'),
                      width: 60,
                      render: (_, row: FormListFieldData) => {
                        return (
                          <IconButton
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
                    <IconButton
                      icon={<PlusCircleOutlined />}
                      size='small'
                      onClick={() => add(defaultValues)}
                    />
                  )}
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

function removeDulpicateProperties(properties: CharacteristicData.DisplayProperty[]) {
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

function NormalizeAttitudeIndexProperty(property: CharacteristicData.DisplayProperty) {
  const p = { ...property };
  return p.key === 'attitude' ? { ...p, key: p.fields?.[0]?.key ?? p.key } : p;
}
