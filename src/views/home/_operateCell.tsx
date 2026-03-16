import React from 'react';
import { Form, Space } from 'antd';
import { Translation } from 'locales/utils';
import { AssetModel, AssetRow, deleteAsset, updateAsset, useContext } from '../../asset-common';
import { ModalFormProps } from '../../types/common';
import { ModalWrapper } from '../../components/modalWrapper';
import { DeleteIconButton, EditIconButton, SelectFormItem, TextFormItem } from '../../components';
import { isAssetAreaParent } from '../../asset-variant';
import { CanAccess, Permission } from '../../providers/access-control';

export const OperateCell = ({ asset }: { asset: AssetRow }) => {
  const { refresh } = useContext();
  const [open, setOpen] = React.useState(false);
  return (
    <Space>
      <CanAccess {...Permission.MeasurementEdit}>
        <EditIconButton onClick={() => setOpen(true)} />
      </CanAccess>
      <CanAccess {...Permission.MeasurementDelete}>
        <DeleteIconButton
          confirmProps={{
            description: Translation.get('feedback.prompt.delete'),
            onConfirm: () => {
              deleteAsset(asset.id).then(() => refresh(true));
            }
          }}
        />
      </CanAccess>
      {open && (
        <UpdateAssetModal
          asset={asset}
          open={open}
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            refresh(true);
          }}
        />
      )}
    </Space>
  );
};

function UpdateAssetModal({ asset, onSuccess, ...rest }: ModalFormProps & { asset: AssetRow }) {
  const [form] = Form.useForm<AssetModel>();
  const { assets } = useContext();
  const parents = assets.filter(isAssetAreaParent);

  return (
    <ModalWrapper
      {...rest}
      afterClose={() => form.resetFields()}
      okText={Translation.get('common.action.save')}
      onOk={() => {
        form.validateFields().then((values) => {
          try {
            updateAsset(asset.id, { ...values, type: asset.type }).then(() => {
              onSuccess();
            });
          } catch (error) {
            console.log(error);
          }
        });
      }}
      title={Translation.editSth('asset')}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          name: asset.name,
          parent_id: asset.parentId > 0 ? asset.parentId : undefined
        }}
      >
        <TextFormItem
          label='common.name'
          name='name'
          rules={[{ required: true }, { min: 4, max: 50 }]}
        />
        {asset.parentId > 0 && (
          <SelectFormItem
            label='asset'
            name='parent_id'
            selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
          />
        )}
      </Form>
    </ModalWrapper>
  );
}
