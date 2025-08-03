import React from 'react';
import { Col, Form, Switch } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { ModalWrapper } from '../../../components/modalWrapper';
import { generateColProps } from '../../../utils/grid';
import {
  Grid,
  NumberFormItem,
  NumberFormItemWithSwitcher,
  SelectFormItem,
  TextFormItem
} from '../../../components';
import { SAMPLING_OFFSET, SAMPLING_PERIOD_2 } from '../../../constants';
import { addAsset, AssetModel, useContext } from '../../../asset-common';
import { AlarmLevel } from '../../alarm';
import { useParentTypes } from '../utils';
import { wind, flange } from '../constants';
import { categories } from './common';

export const Create = (props: ModalFormProps & { windId?: number }) => {
  const { onSuccess, windId } = props;
  const [form] = Form.useForm<AssetModel>();
  const { label } = wind;
  const { type } = flange;
  const [isFlangePreload, setIsFlangePreload] = React.useState(false);
  const { assets } = useContext();
  const parentTypes = useParentTypes(type);
  const winds = windId
    ? []
    : assets.filter((a) => parentTypes.map(({ type }) => type).includes(a.type));
  const formItemColProps = generateColProps({ xl: 12, xxl: 12 });

  const renderParent = () => {
    if (windId) {
      return <TextFormItem name='parent_id' hidden={true} initialValue={windId} />;
    } else if (winds.length >= 0) {
      return (
        <Col {...formItemColProps}>
          <SelectFormItem
            label={label}
            name='parent_id'
            rules={[{ required: true }]}
            selectProps={{ options: winds.map(({ id, name }) => ({ label: name, value: id })) }}
          />
        </Col>
      );
    }
  };

  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: intl.get('CREATE_SOMETHING', { something: intl.get(flange.label) }),
        okText: intl.get('CREATE'),
        ...props,
        onOk: () => {
          form.validateFields().then((values) => {
            const _values = {
              ...values,
              attributes: {
                ...values.attributes,
                sub_type: Number(values.attributes?.sub_type)
              }
            };
            try {
              addAsset(_values as any).then(() => {
                onSuccess();
              });
            } catch (error) {
              console.log(error);
            }
          });
        }
      }}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          type,
          attributes: {
            index: 1,
            sub_type: false,
            normal: { enabled: false },
            initial: { enabled: false },
            info: { enabled: false },
            warn: { enabled: false },
            danger: { enabled: false }
          }
        }}
      >
        <Grid>
          <Col {...formItemColProps}>
            <TextFormItem
              label='NAME'
              name='name'
              rules={[{ required: true }, { min: 4, max: 50 }]}
            />
            <TextFormItem name='type' hidden={true} />
          </Col>
          {renderParent()}
          <Col {...formItemColProps}>
            <SelectFormItem
              label='FLANGE_TYPE'
              name={['attributes', 'type']}
              rules={[{ required: true }]}
              selectProps={{
                options: categories.map(({ value, label }) => ({ label: intl.get(label), value }))
              }}
            />
          </Col>
          <Col {...formItemColProps}>
            <SelectFormItem
              label='INDEX_NUMBER'
              name={['attributes', 'index']}
              selectProps={{ options: [1, 2, 3, 4, 5].map((value) => ({ label: value, value })) }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher label='RATING' name={['attributes', 'normal']} />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher label='INITIAL_VALUE' name={['attributes', 'initial']} />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher
              label={`leveled.alarm.${AlarmLevel.Minor}`}
              name={['attributes', 'info']}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher
              label={`leveled.alarm.${AlarmLevel.Major}`}
              name={['attributes', 'warn']}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher
              label={`leveled.alarm.${AlarmLevel.Critical}`}
              name={['attributes', 'danger']}
            />
          </Col>
          <Col {...formItemColProps}>
            <TextFormItem
              label='CALCULATE_FLANGE_PRELOAD'
              name={['attributes', 'sub_type']}
              valuePropName='checked'
            >
              <Switch onChange={setIsFlangePreload} />
            </TextFormItem>
          </Col>
          {isFlangePreload && (
            <>
              <Col {...formItemColProps}>
                <NumberFormItem
                  label='NUMBER_OF_BOLT'
                  name={['attributes', 'monitoring_points_num']}
                  rules={[{ required: true }]}
                  inputNumberProps={{ min: 1 }}
                />
              </Col>
              <Col {...formItemColProps}>
                <SelectFormItem
                  label='SAMPLING_PERIOD'
                  name={['attributes', 'sample_period']}
                  rules={[{ required: true }]}
                  selectProps={{
                    options: SAMPLING_PERIOD_2.map(({ text, value }) => ({
                      label: intl.get(text),
                      value
                    }))
                  }}
                />
              </Col>
              <Col {...formItemColProps}>
                <SelectFormItem
                  label='SAMPLING_OFFSET'
                  name={['attributes', 'sample_time_offset']}
                  rules={[{ required: true }]}
                  selectProps={{
                    options: SAMPLING_OFFSET.map(({ text, value }) => ({
                      label: intl.get(text),
                      value
                    }))
                  }}
                />
              </Col>
              <Col {...formItemColProps}>
                <NumberFormItem
                  label='INITIAL_PRELOAD'
                  name={['attributes', 'initial_preload']}
                  rules={[{ required: true }]}
                  inputNumberProps={{ addonAfter: 'kN' }}
                />
              </Col>
              <Col {...formItemColProps}>
                <NumberFormItem
                  label='INITIAL_PRESSURE'
                  name={['attributes', 'initial_pressure']}
                  rules={[{ required: true }]}
                  inputNumberProps={{ addonAfter: 'MPa' }}
                />
              </Col>
            </>
          )}
        </Grid>
      </Form>
    </ModalWrapper>
  );
};
