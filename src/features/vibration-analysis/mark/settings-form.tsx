import React from 'react';
import { Col, Form, Switch } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from 'types/common';
import { ModalWrapper } from 'components/modalWrapper';
import { Grid, MutedCard, NumberFormItem, RadioFormItem, SelectFormItem } from 'components';
import { iterate } from 'utils';
import { MarkSettings, settingsDefaultValue, useMarkContext } from './context';

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

export const SettingsForm = (
  props: ModalFormProps & { type: 'frequency' | 'envelope'; base?: number }
) => {
  const [form] = Form.useForm<MarkSettings>();
  const { settings, setSettings } = useMarkContext();
  const [enabledHarmonic, setEnabledHarmonic] = React.useState(settings.harmonic.enabled);
  const [enabledSideband, setEnabledSideband] = React.useState(settings.sideband.enabled);

  const updateAndSave = (values: MarkSettings) => {
    localStorage.setItem(
      `${props.type}-settings`,
      JSON.stringify(removeHarmonicFromSettings(values))
    );
    setSettings(values);
  };

  return (
    <ModalWrapper
      {...props}
      onOk={() =>
        form.validateFields().then((values) => {
          updateAndSave(values);
          props.onSuccess();
        })
      }
      cancelButtonProps={{
        onClick: () => {
          form.resetFields(['harmonic', 'sideband', 'faultFrequency', 'top10']);
          updateAndSave(mergeHarmonicWithSettings(settingsDefaultValue));
          form.setFieldsValue(settingsDefaultValue);
          form.setFieldValue(['sideband', 'center'], undefined);
        }
      }}
      cancelText={intl.get('RESET')}
      title={intl.get('nums.of.cursors.settings')}
      width={500}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={mergeHarmonicWithSettings(settings, props.base)}
      >
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
              <NumberFormItem
                label='harmonic.1x'
                name={['harmonic', 'base']}
                inputNumberProps={{ disabled: !enabledHarmonic, addonAfter: 'Hz' }}
              />
            </Col>
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
                inputNumberProps={{ disabled: !enabledSideband, addonAfter: 'Hz' }}
              />
            </Col>
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
          </Grid>
        </MutedCard>
        <RadioFormItem label='analysis.vibration.cursor.faultfrequency' name='faultFrequency' />
        <RadioFormItem label='analysis.vibration.cursor.top10' name='top10' />
      </Form>
    </ModalWrapper>
  );
};

export const getAnalysisSettings = ( type?: 'frequency' | 'envelope') => {
  const store = localStorage.getItem(`${type}-settings`);
  if (store) {
    return JSON.parse(store) as MarkSettings;
  }
};

export const mergeHarmonicWithSettings = (settings: MarkSettings, harmonic?: number) => {
  return {
    ...settings,
    harmonic: { ...settings.harmonic, base: harmonic },
    sideband: { ...settings.sideband, distance: harmonic }
  };
};

const removeHarmonicFromSettings = (settings: MarkSettings) => {
  return {
    ...settings,
    harmonic: { cursor: settings.harmonic.cursor, enabled: settings.harmonic.enabled },
    sideband: {
      cursor: settings.sideband.cursor,
      enabled: settings.sideband.enabled,
      center: settings.sideband.center
    }
  };
};
