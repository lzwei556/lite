import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
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
        title: intl.get('CREATE_SOMETHING', { something: intl.get('ASSET') }),
        okText: intl.get('CREATE'),
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
          label='TYPE'
          name='type'
          rules={[{ required: true }]}
          selectProps={{
            onChange: setType,
            options: [
              { label: intl.get(wind.label), value: wind.type },
              { label: intl.get(area.label), value: area.type }
            ]
          }}
        />
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
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
