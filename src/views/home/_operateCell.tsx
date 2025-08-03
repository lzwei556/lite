import React from 'react';
import { Form, Space } from 'antd';
import intl from 'react-intl-universal';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { AssetModel, AssetRow, deleteAsset, updateAsset, useContext } from '../../asset-common';
import { ModalFormProps } from '../../types/common';
import { ModalWrapper } from '../../components/modalWrapper';
import { DeleteIconButton, EditIconButton, SelectFormItem, TextFormItem } from '../../components';
import { isAssetAreaParent } from '../../asset-variant';

export const OperateCell = ({ asset }: { asset: AssetRow }) => {
  const { refresh } = useContext();
  const [open, setOpen] = React.useState(false);
  return (
    <Space>
      <HasPermission value={Permission.MeasurementEdit}>
        <EditIconButton onClick={() => setOpen(true)} />
      </HasPermission>
      <HasPermission value={Permission.MeasurementDelete}>
        <DeleteIconButton
          confirmProps={{
            description: intl.get('DELETE_SOMETHING_PROMPT', { something: asset.name }),
            onConfirm: () => {
              deleteAsset(asset.id).then(() => refresh(true));
            }
          }}
        />
      </HasPermission>
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
      okText={intl.get('SAVE')}
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
      title={intl.get('EDIT_SOMETHING', { something: intl.get('ASSET') })}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        initialValues={{
          name: asset.name,
          parent_id: asset.parentId > 0 ? asset.parentId : undefined
        }}
      >
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
        {asset.parentId > 0 && (
          <SelectFormItem
            label='ASSET'
            name='parent_id'
            selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
          />
        )}
      </Form>
    </ModalWrapper>
  );
}
