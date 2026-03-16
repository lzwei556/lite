import React from 'react';
import { Form } from 'antd';
import { Translation } from 'locales/utils';
import { ModalWrapper } from '../../components/modalWrapper';
import { ModalFormProps } from '../../types/common';
import { area, isAssetAreaParent } from '../../asset-variant';
import { addAsset, AssetModel, useContext } from '../../asset-common';
import { SelectFormItem, TextFormItem } from '../../components';
import { wind } from '../../features/asset-wind-turbine/constants';

export const CreateAsset = (props: ModalFormProps) => {
  const { onSuccess, ...rest } = props;
  const [form] = Form.useForm<AssetModel>();
  const { label } = area;
  const { assets } = useContext();
  const parents = assets.filter(isAssetAreaParent);
  const [type, setType] = React.useState<number | undefined>();

  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: Translation.createSth('asset'),
        okText: Translation.get('common.action.create'),
        ...rest,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              addAsset({ ...values, parent_id: values.parent_id ?? 0 }).then(() => {
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
        <SelectFormItem
          label='common.type'
          name='type'
          rules={[{ required: true }]}
          selectProps={{
            onChange: setType,
            options: [
              { label: Translation.get(wind.label), value: wind.type },
              { label: Translation.get(area.label), value: area.type }
            ]
          }}
        />
        <TextFormItem
          label='common.name'
          name='name'
          rules={[{ required: true }, { min: 4, max: 50 }]}
        />
        {type === area.type && (
          <SelectFormItem
            label={label}
            name='parent_id'
            selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
          />
        )}
      </Form>
    </ModalWrapper>
  );
};
