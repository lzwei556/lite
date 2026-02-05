import { Col, ColProps } from 'antd';
import { AssetRow, useContext } from 'asset-common';
import { canAddAreaChild } from 'common';
import { AssetCategory } from 'common/asset-category';
import { SelectFormItem, TextFormItem } from 'components';
import intl from 'react-intl-universal';

import { generateColProps } from 'utils/grid';

export const FormItemsBasic = ({
  parentId,
  formItemColProps = generateColProps({})
}: {
  parentId?: number;
  formItemColProps?: ColProps;
}) => {
  const parents = useParents();
  console.log('parents', parents);

  return (
    <>
      <Col {...formItemColProps}>
        <TextFormItem label='NAME' name='name' rules={[{ required: true }, { min: 4, max: 50 }]} />
      </Col>
      {(parentId || parents.length > 0) && (
        <Col {...formItemColProps}>
          <SelectFormItem
            label={AssetCategory.Key.getlabelPlural(AssetCategory.Value.Area)}
            name='parent_id'
            selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
          />
        </Col>
      )}
    </>
  );
};

const useParents = () => {
  const { assets } = useContext();
  const parents: AssetRow[] = [];
  assets.forEach((asset) => {
    if (AssetCategory.Value.Area === asset.type && canAddAreaChild(asset, 1)) {
      parents.push(asset);
    }
  });
  return parents;
};
