import React from 'react';
import { Button, Form, Input, Popconfirm, Select, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import { AssetModel, AssetRow, deleteAsset, updateAsset, useContext } from '../asset-common';
import { ModalFormProps } from '../../types/common';
import { ModalWrapper } from '../../components/modalWrapper';
import { FormInputItem } from '../../components/formInputItem';
import { isAssetAreaParent } from '../asset-variant';

export const OperateCell = ({ asset }: { asset: AssetRow }) => {
  const { refresh } = useContext();
  const [open, setOpen] = React.useState(false);
  return (
    <Space>
      <HasPermission value={Permission.MeasurementEdit}>
        <Button
          type='text'
          size='small'
          title={intl.get('EDIT_SOMETHING', {
            something: intl.get('ASSET')
          })}
        >
          <EditOutlined onClick={() => setOpen(true)} />
        </Button>
      </HasPermission>
      <HasPermission value={Permission.MeasurementDelete}>
        <Popconfirm
          title={intl.get('DELETE_SOMETHING_PROMPT', { something: asset.name })}
          onConfirm={() => {
            deleteAsset(asset.id).then(() => refresh(true));
          }}
        >
          <Button
            type='text'
            danger={true}
            size='small'
            title={intl.get('DELETE_SOMETHING', {
              something: intl.get('ASSET')
            })}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
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
        <FormInputItem
          label={intl.get('NAME')}
          name='name'
          requiredMessage={intl.get('PLEASE_ENTER_NAME')}
          lengthLimit={{ min: 4, max: 50, label: intl.get('NAME').toLowerCase() }}
        >
          <Input placeholder={intl.get('PLEASE_ENTER_NAME')} />
        </FormInputItem>
        {asset.parentId > 0 && (
          <Form.Item label={intl.get('ASSET')} name='parent_id'>
            <Select
              placeholder={intl.get('PLEASE_SELECT_SOMETHING', { something: intl.get('ASSET') })}
            >
              {parents.map(({ id, name }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </ModalWrapper>
  );
}
