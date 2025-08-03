import React from 'react';
import { Button, Col, Form } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Card, Grid, TextFormItem } from '../../../components';
import { AssetRow, updateAsset, AssetModel } from '../../../asset-common';
import { generateColProps } from '../../../utils/grid';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const [form] = Form.useForm<AssetModel>();

  return (
    <Card
      extra={
        <Button
          icon={<SaveOutlined />}
          color='primary'
          variant='outlined'
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
          size='small'
        />
      }
      size='small'
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
