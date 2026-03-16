import React from 'react';
import { Form } from 'antd';
import { Translation } from 'locales/utils';
import { ModalWrapper } from '../../components/modalWrapper';
import { SelectFormItem, TextFormItem } from '../../components';
import { ModalFormProps } from '../../types/common';
import { addAsset, AssetModel, useContext } from '../../asset-common';
import { area, isAssetAreaParent } from '../../asset-variant';

export const Create = (props: ModalFormProps & { parentId?: number }) => {
  const { onSuccess, parentId, ...rest } = props;
  const [form] = Form.useForm<AssetModel>();
  const { label, type } = area;
  const { assets } = useContext();
  const parents = parentId ? [] : assets.filter(isAssetAreaParent);

  const renderParent = () => {
    if (parentId) {
      return <TextFormItem name='parent_id' hidden initialValue={parentId} />;
    } else if (parents.length >= 0) {
      return (
        <SelectFormItem
          label={label}
          name='parent_id'
          selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
        />
      );
    }
  };

  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: Translation.createSth(label),
        okText: Translation.get('common.action.create'),
        ...rest,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              addAsset({ ...values, parent_id: values.parent_id ?? 0, type }).then(() => {
                onSuccess();
              });
            } catch (error) {
              console.log(error);
            }
          });
        }
      }}
    >
      <Form form={form} layout='vertical'>
        <TextFormItem
          label='common.name'
          name='name'
          rules={[{ required: true }, { min: 4, max: 50 }]}
        />
        {renderParent()}
      </Form>
    </ModalWrapper>
  );
};
