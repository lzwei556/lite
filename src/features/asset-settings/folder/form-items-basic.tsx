import { Col, ColProps } from 'antd';
import { AssetRow } from 'asset-common';
import { SelectFormItem, TextFormItem } from 'components';
import { FolderAsset } from 'domain/asset';
import { useAssetsContext } from 'providers/assets';
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
            label={FolderAsset.getlabelPlural(FolderAsset.Enum.Area)}
            name='parent_id'
            selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
          />
        </Col>
      )}
    </>
  );
};

const useParents = () => {
  const { assets } = useAssetsContext();
  const parents: AssetRow[] = [];
  assets.forEach((asset) => {
    if (FolderAsset.Enum.Area === asset.type && FolderAsset.canAddAreaChild(asset, 1)) {
      parents.push(asset);
    }
  });
  return parents;
};
