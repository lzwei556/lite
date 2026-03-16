import React from 'react';
import { Col, Form, Switch } from 'antd';
import { Translation } from 'locales/utils';
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
import { AlarmLevel, getLabelByValue } from '../../alarm';
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
        title: Translation.createSth(flange.label),
        okText: Translation.get('common.action.create'),
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
              label='common.name'
              name='name'
              rules={[{ required: true }, { min: 4, max: 50 }]}
            />
            <TextFormItem name='type' hidden={true} />
          </Col>
          {renderParent()}
          <Col {...formItemColProps}>
            <SelectFormItem
              label='asset.flange.type'
              name={['attributes', 'type']}
              rules={[{ required: true }]}
              selectProps={{
                options: categories.map(({ value, label }) => ({
                  label: Translation.get(label),
                  value
                }))
              }}
            />
          </Col>
          <Col {...formItemColProps}>
            <SelectFormItem
              label='common.index'
              name={['attributes', 'index']}
              selectProps={{ options: [1, 2, 3, 4, 5].map((value) => ({ label: value, value })) }}
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher
              label='asset.flange.rating'
              name={['attributes', 'normal']}
              nameMode='mixed'
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher
              label='asset.flange.initial'
              name={['attributes', 'initial']}
              nameMode='mixed'
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher
              label={Translation.leveledAlarm(getLabelByValue(AlarmLevel.Minor))}
              name={['attributes', 'info']}
              nameMode='mixed'
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher
              label={Translation.leveledAlarm(getLabelByValue(AlarmLevel.Major))}
              name={['attributes', 'warn']}
              nameMode='mixed'
            />
          </Col>
          <Col {...formItemColProps}>
            <NumberFormItemWithSwitcher
              label={Translation.leveledAlarm(getLabelByValue(AlarmLevel.Critical))}
              name={['attributes', 'danger']}
              nameMode='mixed'
            />
          </Col>
          <Col {...formItemColProps}>
            <TextFormItem
              label='asset.flange.calculation.enabled'
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
                  label='asset.flange.numbers.of.bolt'
                  name={['attributes', 'monitoring_points_num']}
                  rules={[{ required: true }]}
                  inputNumberProps={{ min: 1 }}
                />
              </Col>
              <Col {...formItemColProps}>
                <SelectFormItem
                  label='asset.flange.sampling.period'
                  name={['attributes', 'sample_period']}
                  rules={[{ required: true }]}
                  selectProps={{
                    options: SAMPLING_PERIOD_2.map(({ label, value }) => ({
                      label: Translation.get(...label),
                      value
                    }))
                  }}
                />
              </Col>
              <Col {...formItemColProps}>
                <SelectFormItem
                  label='asset.flange.sampling.offset'
                  name={['attributes', 'sample_time_offset']}
                  rules={[{ required: true }]}
                  selectProps={{
                    options: SAMPLING_OFFSET.map(({ label, value }) => ({
                      label: Translation.get(...label),
                      value
                    }))
                  }}
                />
              </Col>
              <Col {...formItemColProps}>
                <NumberFormItem
                  label='asset.flange.initial.preload'
                  name={['attributes', 'initial_preload']}
                  rules={[{ required: true }]}
                  inputNumberProps={{ addonAfter: 'kN' }}
                />
              </Col>
              <Col {...formItemColProps}>
                <NumberFormItem
                  label='asset.flange.initial.stress'
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
