import React from 'react';
import { Button, Form } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../../types/common';
import { Card } from '../../../../components';
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
        <Button
          icon={<SaveOutlined />}
          color='primary'
          variant='outlined'
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
          size='small'
        />
      }
      size='small'
      title={intl.get('BASIC_INFORMATION')}
    >
      <Form form={form} layout='vertical' initialValues={{ ...Asset.convert(asset) }}>
        <UpdateFormItems
          asset={asset}
          formItemColProps={generateColProps({ lg: 12, xl: 8, xxl: 8 })}
        />
      </Form>
    </Card>
  );
};
