import * as React from 'react';
import { Checkbox, Form, ModalProps, Col, Button } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from 'components/modalWrapper';
import { Card, CheckboxFormItem, Grid } from 'components';
import { ActionModalContext, createSubmitHandler } from 'resource';
import { getFilename } from 'utils/format';
import { download, AlarmRule } from 'domains/alarm-rule';
import { downloadFile } from 'utils';

export const SelectRules = (
  props: { rules: AlarmRule[] } & ModalProps & ActionModalContext<any, any>
) => {
  const [form] = Form.useForm();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleUpload = (ruleIds?: number[]) => {
    if (props.submit) {
      createSubmitHandler(props.submit, props.close)(ruleIds as any);
      return;
    }

    download(ruleIds)
      .then((res) => {
        downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
      })
      .finally(() => {
        setLoading(false);
        form.resetFields();
        setSelected([]);
        props.close();
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
          <CheckboxFormItem
            name='asset_ids'
            noStyle
            checkboxGroupProps={{
              children: (
                <Grid>
                  {props.rules.map(({ id, name }) => (
                    <Col span={12} key={id}>
                      <Checkbox value={id}>{intl.get(name).d(name)}</Checkbox>
                    </Col>
                  ))}
                </Grid>
              ),
              onChange: setSelected,
              style: { width: '100%' }
            }}
          />
        </Form>
      </Card>
    </ModalWrapper>
  );
};
