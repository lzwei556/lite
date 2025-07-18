import React from 'react';
import { Button, Form } from 'antd';
import intl from 'react-intl-universal';
import { Flex } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import { AssetModel, AssetRow, updateAsset } from '../../asset-common';
import { UpdateAssetFormItems, getByType, motor } from '../../asset-variant';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const { name, parentId, type } = asset;
  const [form] = Form.useForm<AssetModel>();

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        name,
        parent_id: parentId,
        type,
        ...(asset.attributes
          ? { attributes: asset.attributes }
          : getByType(type)?.settings?.default)
      }}
    >
      <UpdateAssetFormItems
        asset={asset}
        types={[motor]}
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
