import { Col, ColProps } from 'antd';
import { SelectFormItem, TextFormItem } from 'components';
import React from 'react';
import { generateColProps } from 'utils/grid';
import { useParents, useType } from './use-basic-form-items';
import { useFormItemBindingsProps } from 'hooks';
import { AssetCategory } from 'common/asset-category';
import intl from 'react-intl-universal';

export const FormItemsBasic = ({
  formItemColProps = generateColProps({}),
  parentSelectFormItem,
  typeSelectFormItem
}: {
  formItemColProps?: ColProps;
  parentSelectFormItem: React.ReactElement;
  typeSelectFormItem: React.ReactElement;
}) => {
  return (
    <>
      <Col {...formItemColProps}>
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
      </Col>
      <Col {...formItemColProps}>{parentSelectFormItem}</Col>
      <Col {...formItemColProps}>{typeSelectFormItem}</Col>
    </>
  );
};

export const ParentSelectFormItem = (props: Parameters<typeof useParents>[0]) => {
  const parents = useParents(props);
  const formItemProps = useFormItemBindingsProps({ label: 'ASSET', name: 'parent_id' });
  return props?.assetId ? (
    <TextFormItem {...{ ...formItemProps, hidden: true, initialValue: props.assetId }} />
  ) : (
    <SelectFormItem
      {...{
        ...formItemProps,
        rules: [{ required: true }],
        selectProps: { options: parents.map(({ id, name }) => ({ label: name, value: id })) }
      }}
    />
  );
};

export const TypeSelectFormItem = (props: Omit<ReturnType<typeof useType>, 'selectedType'>) => {
  return (
    <SelectFormItem
      {...{
        ...useFormItemBindingsProps({ label: 'TYPE', name: 'type', rules: [{ required: true }] }),
        selectProps: {
          ...props,
          options: AssetCategory.Categories.getOptions([
            'bolt',
            'corrosion',
            'device',
            'vibration'
          ]).map((t) => ({ ...t, label: intl.get(t.label) }))
        }
      }}
    />
  );
};
