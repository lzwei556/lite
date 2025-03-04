import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { ModalWrapper } from '../../../components/modalWrapper';
import { Asset, AssetModel, AssetRow, updateAsset } from '../../asset-common';
import { UpdateFormItems } from './_updateFormItems';

export const UpdateModal = (props: ModalFormProps & { asset: AssetRow }) => {
  const { asset, onSuccess, ...rest } = props;
  const [form] = Form.useForm<AssetModel>();

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      okText={intl.get('SAVE')}
      onOk={() => {
        form.validateFields().then((values) => {
          try {
            const _values = {
              ...values,
              attributes: {
                ...values.attributes,
                monitoring_points_num: Number(values.attributes?.monitoring_points_num),
                sub_type: Number(values.attributes?.sub_type),
                initial_preload: Number(values.attributes?.initial_preload),
                initial_pressure: Number(values.attributes?.initial_pressure)
              }
            };
            updateAsset(asset.id, _values as any).then(onSuccess);
          } catch (error) {
            console.log(error);
          }
        });
      }}
      title={intl.get('EDIT_SOMETHING', { something: intl.get('FLANGE') })}
    >
      <Form form={form} labelCol={{ span: 7 }} initialValues={{ ...Asset.convert(asset) }}>
        <UpdateFormItems asset={asset} />
      </Form>
    </ModalWrapper>
  );
};
