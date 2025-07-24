import React from 'react';
import { Button, Form, Space } from 'antd';
import intl from 'react-intl-universal';
import { Card } from '../../../components';
import { AssetRow, updateAsset, AssetModel } from '../../asset-common';
import { UpdateFormItems } from '../updateFormItems';
import { SaveOutlined } from '@ant-design/icons';
import { generateColProps } from '../../../utils/grid';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const [form] = Form.useForm<AssetModel>();

  return (
    <Card
      extra={
        <Space>
          <Button
            color='primary'
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
            icon={<SaveOutlined />}
            size='small'
            variant='outlined'
          />
        </Space>
      }
      size='small'
      title={intl.get('BASIC_INFORMATION')}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          name: asset.name,
          parent_id: asset.parentId > 0 ? asset.parentId : undefined
        }}
      >
        <UpdateFormItems asset={asset} formItemColProps={generateColProps({ xl: 12, xxl: 12 })} />
      </Form>
    </Card>
  );
};
