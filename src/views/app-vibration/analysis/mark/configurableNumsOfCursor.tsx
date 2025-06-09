import React from 'react';
import { Form, Select } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../../components/modalWrapper';
import { ModalFormProps } from '../../../../types/common';

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
        initialValues={nums ?? { harmonic: HarmonicCursor.Five, sideband: SidebandCursor.Five }}
      >
        <Form.Item label={intl.get('harmonic.cursor.nums')} name='harmonic'>
          <Select options={HARMONIC_CURSOR_NUMS.map((n) => ({ label: `${n}`, value: n }))} />
        </Form.Item>
        <Form.Item label={intl.get('sideband.cursor.nums')} name='sideband'>
          <Select options={SIDEBAND_CURSOR_NUMS.map((n) => ({ label: `${n}`, value: n }))} />
        </Form.Item>
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
