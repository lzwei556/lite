import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../../components/modalWrapper';
import { ModalFormProps } from '../../../../types/common';
import { SelectFormItem } from '../../../../components';

enum HarmonicCursor {
  One = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten
}
enum SidebandCursor {
  Three = 3,
  Five = 5,
  Seven = 7,
  Nine = 9
}
const HARMONIC_CURSOR_NUMS = Object.values(HarmonicCursor).filter(
  (value) => typeof value === 'number'
);
const SIDEBAND_CURSOR_NUMS = Object.values(SidebandCursor).filter(
  (value) => typeof value === 'number'
);

type Nums = { harmonic: number; sideband: number };

export const ConfigurableNumsOfCursor = (props: ModalFormProps) => {
  const [form] = Form.useForm<Nums>();
  const nums = getNumsOfCursor();
  return (
    <ModalWrapper
      {...props}
      onOk={() =>
        form.validateFields().then((values) => {
          localStorage.setItem('nums-cursors-vibration', JSON.stringify(values));
          props.onSuccess();
        })
      }
      title={intl.get('nums.of.cursors.settings')}
      width={400}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={nums ?? { harmonic: HarmonicCursor.Five, sideband: SidebandCursor.Five }}
      >
        <SelectFormItem
          label='harmonic.cursor.nums'
          name='harmonic'
          selectProps={{ options: HARMONIC_CURSOR_NUMS.map((n) => ({ label: `${n}`, value: n })) }}
        />
        <SelectFormItem
          label='sideband.cursor.nums'
          name='sideband'
          selectProps={{ options: SIDEBAND_CURSOR_NUMS.map((n) => ({ label: `${n}`, value: n })) }}
        />
      </Form>
    </ModalWrapper>
  );
};

export const getNumsOfCursor = () => {
  let nums: Nums = { harmonic: HarmonicCursor.Five, sideband: SidebandCursor.Five };
  const store = localStorage.getItem('nums-cursors-vibration');
  if (store) {
    nums = JSON.parse(store);
  }
  return nums;
};
