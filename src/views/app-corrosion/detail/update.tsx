import React from 'react';
import { Button, Form } from 'antd';
import intl from 'react-intl-universal';
import { Flex } from '../../../components';
import { AssetModel, AssetRow, updateAsset } from '../../asset-common';
import { pipe, tank, UpdateAssetFormItems } from '../../asset-variant';
import { generateColProps } from '../../../utils/grid';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const { name, parentId, type } = asset;
  const [form] = Form.useForm<AssetModel>();

  return (
    <Form form={form} layout='vertical' initialValues={{ name, parent_id: parentId, type }}>
      <UpdateAssetFormItems
        asset={asset}
        types={[pipe, tank]}
        formItemColProps={generateColProps({ xl: 8, xxl: 8 })}
      />
      <Flex>
        <Button
          type='primary'
          onClick={() => {
            form.validateFields().then((values) => {
              try {
                updateAsset(asset.id, { ...values, type }).then(() => {
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
  );
};
