import React from 'react';
import { Button, Form } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { Card } from '../../../components';
import { generateColProps } from '../../../utils/grid';
import { AssetModel, AssetRow, updateAsset } from '../../../asset-common';
import { BasisFormItems, SettingFormItems, getByType, motor } from '../../../asset-variant';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const { name, parentId, type } = asset;
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
                updateAsset(asset.id, { ...values, type }).then(() => {
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
        <BasisFormItems types={[motor]} formItemColProps={generateColProps({ xl: 12, xxl: 8 })} />
        {type && (
          <SettingFormItems
            key={type}
            type={type}
            cardProps={{ type: 'inner' }}
            formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
          />
        )}
      </Form>
    </Card>
  );
};
