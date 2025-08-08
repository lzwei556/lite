import * as React from 'react';
import { Checkbox, Form, ModalProps, Col, Button } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../components/modalWrapper';
import { Card, Grid, TextFormItem } from '../../../components';
import { getFilename } from '../../../utils/format';
import { exportAlarmRules } from './services';
import { AlarmRule } from './types';

export const SelectRules: React.FC<{ rules: AlarmRule[]; onSuccess: () => void } & ModalProps> = (
  props
) => {
  const [form] = Form.useForm();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleUpload = (ruleIds?: number[]) => {
    exportAlarmRules(ruleIds)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', getFilename(res));
        document.body.appendChild(link);
        link.click();
        if (!ruleIds) props.onSuccess();
      })
      .finally(() => {
        setLoading(false);
        form.resetFields();
        setSelected([]);
      });
  };

  return (
    <ModalWrapper
      {...props}
      afterClose={() => form.resetFields()}
      title={intl.get('SELECT_ALARM_RULE')}
      footer={[
        <Button key='back' onClick={(e) => props.onCancel && props.onCancel(e as any)}>
          {intl.get('CANCEL')}
        </Button>,
        <Button
          key='submitall'
          onClick={() => {
            setLoading(true);
            handleUpload();
          }}
          loading={loading}
          color='primary'
          variant='outlined'
        >
          {intl.get('EXPORT_ALL')}
        </Button>,
        <Button
          key='submit'
          type='primary'
          disabled={selected.length === 0}
          onClick={() => handleUpload(selected as number[])}
        >
          {intl.get('EXPORT')}
        </Button>
      ]}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form form={form}>
          <TextFormItem name='asset_ids' noStyle>
            <Checkbox.Group onChange={(values) => setSelected(values)}>
              <Grid>
                {props.rules.map(({ id, name }) => (
                  <Col span={12} key={id}>
                    <Checkbox value={id}>{intl.get(name).d(name)}</Checkbox>
                  </Col>
                ))}
              </Grid>
            </Checkbox.Group>
          </TextFormItem>
        </Form>
      </Card>
    </ModalWrapper>
  );
};
