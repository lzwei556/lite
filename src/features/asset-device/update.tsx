import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { Card, SaveIconButton } from '../../components';
import { generateColProps } from '../../utils/grid';
import { AssetModel, AssetRow, updateAsset } from '../../asset-common';
import { BasisFormItems, device, SettingFormItems } from '../../asset-variant';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const { name, parentId, type } = asset;
  const [form] = Form.useForm<AssetModel>();

  return (
    <Card
      extra={
        <SaveIconButton
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
        />
      }
      title={intl.get('BASIC_INFORMATION')}
    >
      <Form form={form} layout='vertical' initialValues={{ name, parent_id: parentId, type }}>
        <BasisFormItems types={[device]} formItemColProps={generateColProps({ xl: 12, xxl: 8 })} />
        {type && (
          <SettingFormItems
            key={type}
            type={type}
            formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
          />
        )}
      </Form>
    </Card>
  );
};
