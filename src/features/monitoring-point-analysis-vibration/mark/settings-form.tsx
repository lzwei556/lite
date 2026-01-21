import React from 'react';
import { Col, Form, Switch } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from 'types/common';
import { ModalWrapper } from 'components/modalWrapper';
import { Grid, MutedCard, NumberFormItem, RadioFormItem, SelectFormItem } from 'components';
import { iterate } from 'utils';
import { MarkSettings, useMarkContext } from './context';

enum CursorAmount {
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
  Three = CursorAmount.Three,
  Five = CursorAmount.Five,
  Seven = CursorAmount.Seven,
  Nine = CursorAmount.Nine
}
const harmonicCursorAmount = iterate(CursorAmount);
const sidebandCursorAmount = iterate(SidebandCursor);

export const SettingsForm = (props: ModalFormProps) => {
  const [form] = Form.useForm<MarkSettings>();
  const { settings, setSettings } = useMarkContext();
  const [enabledHarmonic, setEnabledHarmonic] = React.useState(settings.harmonic.enabled);
  const [enabledSideband, setEnabledSideband] = React.useState(settings.sideband.enabled);

  return (
    <ModalWrapper
      {...props}
      onOk={() =>
        form.validateFields().then((values) => {
          // localStorage.setItem(
          //   'nums-cursors-vibration',
          //   JSON.stringify({ harmonic: values.harmonic.cursor, sideband: values.sideband.cursor })
          // );
          setSettings(values);
          props.onSuccess();
        })
      }
      title={intl.get('nums.of.cursors.settings')}
      width={500}
    >
      <Form form={form} layout='vertical' initialValues={settings}>
        <MutedCard
          extra={
            <Form.Item name={['harmonic', 'enabled']} noStyle>
              <Switch size='small' onChange={setEnabledHarmonic} />
            </Form.Item>
          }
          title={intl.get(`analysis.vibration.cursor.harmonic`)}
        >
          <Grid>
            <Col span={12}>
              <SelectFormItem
                label='cursor.nums'
                name={['harmonic', 'cursor']}
                selectProps={{
                  disabled: !enabledHarmonic,
                  options: harmonicCursorAmount.map((n) => ({ label: `${n}`, value: n }))
                }}
              />
            </Col>
            <Col span={12}>
              <NumberFormItem
                label='harmonic.base'
                name={['harmonic', 'base']}
                inputNumberProps={{ disabled: !enabledHarmonic, addonAfter: 'Hz' }}
              />
            </Col>
          </Grid>
        </MutedCard>
        <MutedCard
          extra={
            <Form.Item name={['sideband', 'enabled']} noStyle>
              <Switch size='small' onChange={setEnabledSideband} />
            </Form.Item>
          }
          style={{ marginBlock: 16 }}
          title={intl.get(`analysis.vibration.cursor.sideband`)}
        >
          <Grid>
            <Col span={12}>
              <SelectFormItem
                label='cursor.nums'
                name={['sideband', 'cursor']}
                selectProps={{
                  disabled: !enabledSideband,
                  options: sidebandCursorAmount.map((n) => ({ label: `${n}`, value: n }))
                }}
              />
            </Col>
            <Col span={12}>
              <NumberFormItem
                label='sideband.center'
                name={['sideband', 'center']}
                inputNumberProps={{ disabled: !enabledSideband, addonAfter: 'Hz' }}
              />
            </Col>
            <Col span={12}>
              <NumberFormItem
                label='sideband.distance'
                name={['sideband', 'distance']}
                inputNumberProps={{ disabled: !enabledSideband }}
              />
            </Col>
          </Grid>
        </MutedCard>
        <RadioFormItem label='analysis.vibration.cursor.faultfrequency' name='faultFrequency' />
        <RadioFormItem label='analysis.vibration.cursor.top10' name='top10' />
      </Form>
    </ModalWrapper>
  );
};

export const getNumsOfCursor = () => {
  let nums = { harmonic: CursorAmount.Five, sideband: SidebandCursor.Five };
  const store = localStorage.getItem('nums-cursors-vibration');
  if (store) {
    nums = JSON.parse(store);
  }
  return nums;
};
