import React from 'react';
import { Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { Card, Grid, SaveIconButton, TextFormItem } from '../../../components';
import { AssetRow, updateAsset, AssetModel } from '../../../asset-common';
import { generateColProps } from '../../../utils/grid';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const [form] = Form.useForm<AssetModel>();

  return (
    <Card
      extra={
        <SaveIconButton
          onClick={() => {
            form.validateFields().then((values) => {
              try {
                updateAsset(asset.id, { ...values, type: asset.type }).then(() => {
                  onSuccess();
                });
              } catch (error) {
                console.log(error);
              }
            });
          }}
        />
      }
      title={intl.get('BASIC_INFORMATION')}
    >
      <Form form={form} layout='vertical' initialValues={{ name: asset.name }}>
        <Grid>
          <Col {...generateColProps({ xl: 12, xxl: 12 })}>
            <TextFormItem
              label='NAME'
              name='name'
              rules={[{ required: true }, { min: 4, max: 50 }]}
            />
          </Col>
        </Grid>
      </Form>
    </Card>
  );
};
