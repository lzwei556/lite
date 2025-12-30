import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../components/modalWrapper';
import { ModalFormProps } from '../types/common';
import { generateColProps } from '../utils/grid';
import { AssetModel, AssetRow, updateAsset } from '../asset-common';
import { BasisFormItems } from './basisFormItems';
import { SettingFormItems } from './settingFormItems';
import { useAssetCategories } from '../features/asset-area';
import { Card } from '../components';

export const UpdateModal = (props: ModalFormProps & { asset: AssetRow }) => {
  const { asset, onSuccess, ...rest } = props;
  const { id, name, parentId, type } = asset;
  const [form] = Form.useForm<AssetModel>();
  const label = intl.get('ASSET');

  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: intl.get('EDIT_SOMETHING', { something: label }),
        okText: intl.get('SAVE'),
        ...rest,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              updateAsset(id, { ...values, type }).then(() => {
                onSuccess();
              });
            } catch (error) {
              console.log(error);
            }
          });
        },
        width: 600
      }}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...asset,
          name,
          parent_id: parentId,
          type
        }}
      >
        <Card size='small' style={{ marginBottom: 16 }} title={intl.get('BASIC_INFORMATION')}>
          <BasisFormItems
            types={useAssetCategories()}
            formItemColProps={generateColProps({ xl: 12, xxl: 12 })}
          />
        </Card>
        {type && (
          <SettingFormItems
            key={type}
            type={type}
            formItemColProps={generateColProps({ xl: 12, xxl: 12 })}
            specialFormItemColProps={{ 'vel_base.vel_base_1_10X': generateColProps({}) }}
          />
        )}
      </Form>
    </ModalWrapper>
  );
};
