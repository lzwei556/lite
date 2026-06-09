import { Col, ColProps } from 'antd';
import { RadioFormItem, SelectFormItem, TextFormItem } from 'components';
import React from 'react';
import { generateColProps } from 'utils/grid';
import { useParents, useType } from './use-basic-form-items';
import { useFormItemBindingsProps } from 'hooks';
import intl from 'react-intl-universal';
import { AssetRow } from 'asset-common';
import { FolderAsset, PrimaryAsset } from 'domains/asset';

export const FormItemsBasic = ({
  formItemColProps = generateColProps({}),
  parentSelectFormItem,
  typeSelectFormItem,
  diagnosisFormItems
}: {
  formItemColProps?: ColProps;
  parentSelectFormItem: React.ReactElement;
  typeSelectFormItem: React.ReactElement;
  diagnosisFormItems?: React.ReactNode;
}) => {
  return (
    <>
      <Col {...formItemColProps}>
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
      </Col>
      {parentSelectFormItem}
      <Col {...formItemColProps}>{typeSelectFormItem}</Col>
      {diagnosisFormItems}
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
      ? FolderAsset.getChildrenOptions([parentType])
      : PrimaryAsset.Category.getTypeOptions(['bolt', 'corrosion', 'device', 'vibration'])
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

export const DiagnosisFormItems = ({
  asset,
  formItemColProps = generateColProps({})
}: {
  asset: AssetRow;
  formItemColProps?: ColProps;
}) => {
  const [enabled, setEnabled] = React.useState(asset.diagnosisIsEnabled);
  const diagnosisEnabledFormItemProps = useFormItemBindingsProps({
    name: 'diagnosis_is_enabled',
    label: 'diagnosis.enabled'
  });
  const diagnosisFormItemProps = useFormItemBindingsProps({
    name: 'diagnosis_period',
    label: 'diagnosis.period',
    initialValue: 0
  });
  return (
    <>
      <Col {...formItemColProps}>
        <RadioFormItem
          {...diagnosisEnabledFormItemProps}
          radioGroupProps={{ onChange: (e) => setEnabled(e.target.value) }}
        />
      </Col>
      {enabled && (
        <Col {...formItemColProps}>
          <SelectFormItem
            {...diagnosisFormItemProps}
            selectProps={{
              options: [
                { label: intl.get('diagnosis.period.real'), value: 0 },
                { label: intl.get('OPTION_1_HOUR'), value: 60 * 60 },
                { label: intl.get('OPTION_2_HOURS'), value: 2 * 60 * 60 },
                { label: intl.get('OPTION_4_HOURS'), value: 4 * 60 * 60 },
                { label: intl.get('OPTION_8_HOURS'), value: 8 * 60 * 60 },
                { label: intl.get('OPTION_12_HOURS'), value: 12 * 60 * 60 },
                { label: intl.get('OPTION_24_HOURS'), value: 24 * 60 * 60 }
              ]
            }}
          />
        </Col>
      )}
    </>
  );
};
