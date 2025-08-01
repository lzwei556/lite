import React from 'react';
import { Button, Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { Flex, Grid, TextFormItem } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import { AssetRow, updateAsset, AssetModel } from '../../asset-common';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const [form] = Form.useForm<AssetModel>();

  return (
    <Grid style={{ marginTop: 16 }}>
      <Col {...generateColProps({ md: 12, lg: 12, xl: 12, xxl: 8 })}>
        <Form form={form} labelCol={{ span: 6 }} initialValues={{ name: asset.name }}>
          <TextFormItem
            label='NAME'
            name='name'
            rules={[{ required: true }, { min: 4, max: 50 }]}
          />
          <Flex style={{ marginTop: 12 }}>
            <Button
              type='primary'
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
            >
              {intl.get('SAVE')}
            </Button>
          </Flex>
        </Form>
      </Col>
    </Grid>
  );
};
