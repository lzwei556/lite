import * as React from 'react';
import { Checkbox, Form, ModalProps, Col, Button } from 'antd';
import intl from 'react-intl-universal';
import { AssetRow, exportAssets } from '../asset-common';
import { getProject } from '../../utils/session';
import { getFilename } from '../../utils/format';
import { ModalWrapper } from '../../components/modalWrapper';
import { Card, Grid, TextFormItem } from '../../components';

export const SelectAssets: React.FC<{ assets: AssetRow[]; onSuccess: () => void } & ModalProps> = (
  props
) => {
  const [form] = Form.useForm();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleUpload = (windIds?: number[]) => {
    exportAssets(getProject().id, windIds)
      .then((res) => {
        if (!windIds) props.onSuccess();
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', getFilename(res));
        document.body.appendChild(link);
        link.click();
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
      title={intl.get('EXPORT')}
      footer={[
        <Button key='back' onClick={(e) => props.onCancel && props.onCancel(e as any)}>
          {intl.get('CANCEL')}
        </Button>,
        <Button
          key='submitall'
          type='primary'
          onClick={() => {
            setLoading(true);
            handleUpload();
          }}
          loading={loading}
        >
          {intl.get('EXPORT_ALL')}
        </Button>,
        <Button
          key='submit'
          type='primary'
          disabled={selected.length === 0}
          onClick={() => handleUpload(selected)}
        >
          {intl.get('EXPORT')}
        </Button>
      ]}
    >
      <Card>
        <Form form={form}>
          <TextFormItem name='asset_ids' noStyle>
            <Checkbox.Group onChange={(values) => setSelected(values)}>
              <Grid>
                {props.assets.map(({ id, name }) => (
                  <Col span={12} key={id}>
                    <Checkbox value={id}>{name}</Checkbox>
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
