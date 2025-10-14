import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { generateColProps } from '../../../../utils/grid';
import { ModalFormProps } from '../../../../types/common';
import { Card, SaveIconButton } from '../../../../components';
import { Asset, AssetModel, AssetRow, updateAsset } from '../../../../asset-common';
import { UpdateFormItems } from '../_updateFormItems';
import { CanAccess, Permission } from '../../../../providers/access-control';

export const Update = (props: ModalFormProps & { asset: AssetRow }) => {
  const { asset, onSuccess } = props;
  const [form] = Form.useForm<AssetModel>();

  return (
    <Card
      extra={
        <CanAccess {...Permission.AssetEdit}>
          <SaveIconButton
            onClick={() => {
              form.validateFields().then((values) => {
                try {
                  updateAsset(asset.id, values).then(onSuccess);
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
      <Form form={form} layout='vertical' initialValues={{ ...Asset.convert(asset) }}>
        <UpdateFormItems formItemColProps={generateColProps({ lg: 12, xl: 12, xxl: 8 })} />
      </Form>
    </Card>
  );
};
