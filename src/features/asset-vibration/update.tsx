import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { Card, SaveIconButton } from '../../components';
import { generateColProps } from '../../utils/grid';
import { AssetModel, AssetRow, updateAsset } from '../../asset-common';
import { BasisFormItems, SettingFormItems, getByType, motor } from '../../asset-variant';
import { CanAccess, Permission } from '../../providers/access-control';

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
      <Card
        extra={
          <CanAccess {...Permission.AssetEdit}>
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
          </CanAccess>
        }
        title={intl.get('BASIC_INFORMATION')}
      >
        <BasisFormItems
          type={asset.type}
          types={[motor]}
          formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
        />
        {type && (
          <SettingFormItems
            key={type}
            type={type}
            formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
            velBaseFormItemColProps={generateColProps({ xl: 24, xxl: 16 })}
          />
        )}
      </Card>
    </Form>
  );
};
