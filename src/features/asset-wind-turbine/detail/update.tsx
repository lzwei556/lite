import React from 'react';
import { Col, Form } from 'antd';
import { Translation } from 'locales/utils';
import { Card, Grid, SaveIconButton, TextFormItem } from '../../../components';
import { AssetRow, updateAsset, AssetModel } from '../../../asset-common';
import { generateColProps } from '../../../utils/grid';
import { CanAccess, Permission } from '../../../providers/access-control';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const [form] = Form.useForm<AssetModel>();

  return (
    <Card
      extra={
        <CanAccess {...Permission.AssetEdit}>
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
        </CanAccess>
      }
      title={Translation.get('common.basic')}
    >
      <Form form={form} layout='vertical' initialValues={{ name: asset.name }}>
        <Grid>
          <Col {...generateColProps({ xl: 12, xxl: 12 })}>
            <TextFormItem
              label='common.name'
              name='name'
              rules={[{ required: true }, { min: 4, max: 50 }]}
            />
          </Col>
        </Grid>
      </Form>
    </Card>
  );
};
