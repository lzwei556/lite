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
      {parentSelectFormItem}
      <Col {...formItemColProps}>{typeSelectFormItem}</Col>
    </>
  );
};

export const ParentSelectFormItem = ({
  assetId,
  formItemColProps = generateColProps({}),
  type
}: Parameters<typeof useParents>[0] & { formItemColProps?: ColProps }) => {
  const parents = useParents({ assetId, type });
  const formItemProps = useFormItemBindingsProps({ label: 'ASSET', name: 'parent_id' });
  return assetId ? (
    <TextFormItem {...{ ...formItemProps, hidden: true, initialValue: assetId }} />
  ) : (
    <Col {...formItemColProps}>
      <SelectFormItem
        {...{
          ...formItemProps,
          rules: [{ required: true }],
          selectProps: { options: parents.map(({ id, name }) => ({ label: name, value: id })) }
        }}
      />
    </Col>
  );
};

export const TypeSelectFormItem = ({
  parentType,
  ...rest
}: Omit<ReturnType<typeof useType>, 'selectedType'> & { parentType?: number }) => {
  const options = (
    parentType
      ? AssetCategory.Key.getChildren(parentType)
      : AssetCategory.Categories.getOptions(['bolt', 'corrosion', 'device', 'vibration'])
  ).map((t) => ({
    ...t,
    label: intl.get(t.label)
  }));
  return (
    <SelectFormItem
      {...{
        ...useFormItemBindingsProps({ label: 'TYPE', name: 'type', rules: [{ required: true }] }),
        selectProps: {
          ...rest,
          options
        }
      }}
    />
  );
};
