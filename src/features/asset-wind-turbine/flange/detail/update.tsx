import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../../types/common';
import { Card, SaveIconButton } from '../../../../components';
import { Asset, AssetModel, AssetRow, updateAsset } from '../../../../asset-common';
import { UpdateFormItems } from '../_updateFormItems';
import { mergeAttrsAboutFlangePreload } from '../common';
import { generateColProps } from '../../../../utils/grid';

export const Update = (props: ModalFormProps & { asset: AssetRow }) => {
  const { asset, onSuccess } = props;
  const [form] = Form.useForm<AssetModel>();

  return (
    <Card
      extra={
        <SaveIconButton
          onClick={() => {
            form.validateFields().then((values) => {
              try {
                const _values = {
                  ...values,
                  attributes: {
                    ...mergeAttrsAboutFlangePreload(values.attributes, asset.attributes),
                    sub_type: Number(values.attributes?.sub_type)
                  }
                };
                updateAsset(asset.id, _values as any).then(onSuccess);
              } catch (error) {
                console.log(error);
              }
            });
          }}
        />
      }
      title={intl.get('BASIC_INFORMATION')}
    >
      <Form form={form} layout='vertical' initialValues={{ ...Asset.convert(asset) }}>
        <UpdateFormItems
          asset={asset}
          formItemColProps={generateColProps({ lg: 12, xl: 12, xxl: 8 })}
        />
      </Form>
    </Card>
  );
};
