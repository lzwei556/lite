import React from 'react';
import { Checkbox, Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { ModalWrapper } from '../../../components/modalWrapper';
import {
  NumberFormItem,
  NumberFormItemWithSwitcher,
  SelectFormItem,
  TextFormItem
} from '../../../components';
import { SAMPLING_OFFSET, SAMPLING_PERIOD_2 } from '../../../constants';
import { addAsset, AssetModel, useContext } from '../../asset-common';
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

  const renderParent = () => {
    if (windId) {
      return <TextFormItem name='parent_id' hidden={true} initialValue={windId} />;
    } else if (winds.length >= 0) {
      return (
        <SelectFormItem
          label={label}
          name='parent_id'
          rules={[{ required: true }]}
          selectProps={{ options: winds.map(({ id, name }) => ({ label: name, value: id })) }}
        />
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
                monitoring_points_num: Number(values.attributes?.monitoring_points_num),
                sub_type: Number(values.attributes?.sub_type),
                initial_preload: Number(values.attributes?.initial_preload),
                initial_pressure: Number(values.attributes?.initial_pressure)
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
      <Form form={form} labelCol={{ span: 7 }}>
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
        <TextFormItem name='type' hidden={true} initialValue={type} />
        {renderParent()}
        <SelectFormItem
          label='FLANGE_TYPE'
          name={['attributes', 'type']}
          rules={[{ required: true }]}
          selectProps={{
            options: categories.map(({ value, label }) => ({ label: intl.get(label), value }))
          }}
        />
        <SelectFormItem
          label='INDEX_NUMBER'
          name={['attributes', 'index']}
          initialValue={1}
          selectProps={{ options: [1, 2, 3, 4, 5].map((value) => ({ label: value, value })) }}
        />
        <NumberFormItemWithSwitcher label='RATING' name={['attributes', 'normal']} />
        <NumberFormItemWithSwitcher label='INITIAL_VALUE' name={['attributes', 'initial']} />
        <NumberFormItemWithSwitcher
          label={`leveled.alarm.${AlarmLevel.Minor}`}
          name={['attributes', 'info']}
        />
        <NumberFormItemWithSwitcher
          label={`leveled.alarm.${AlarmLevel.Major}`}
          name={['attributes', 'warn']}
        />
        <NumberFormItemWithSwitcher
          label={`leveled.alarm.${AlarmLevel.Critical}`}
          name={['attributes', 'danger']}
        />
        <TextFormItem
          name={['attributes', 'sub_type']}
          valuePropName='checked'
          initialValue={false}
        >
          <Checkbox onChange={(e) => setIsFlangePreload(e.target.checked)}>
            {intl.get('CALCULATE_FLANGE_PRELOAD')}
          </Checkbox>
        </TextFormItem>
        {isFlangePreload && (
          <>
            <NumberFormItem
              label='NUMBER_OF_BOLT'
              name={['attributes', 'monitoring_points_num']}
              rules={[{ required: true }]}
              inputNumberProps={{ min: 1 }}
            />
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
            <NumberFormItem
              label='INITIAL_PRELOAD'
              name={['attributes', 'initial_preload']}
              rules={[{ required: true }]}
              inputNumberProps={{ addonAfter: 'kN' }}
            />
            <NumberFormItem
              label='INITIAL_PRESSURE'
              name={['attributes', 'initial_pressure']}
              rules={[{ required: true }]}
              inputNumberProps={{ addonAfter: 'MPa' }}
            />
          </>
        )}
      </Form>
    </ModalWrapper>
  );
};
