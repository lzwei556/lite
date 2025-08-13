import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../types/common';
import { AssetRow } from '../../asset-common';
import { area, CreateAsset, isAssetAreaParent, isAssetValidParent } from '../../asset-variant';
import { useAssetCategories } from './utils';
import { Create } from './create';
import { IconButton } from '../../components';

export const ActionBar = ({
  asset,
  onSuccess,
  short = false
}: {
  asset?: AssetRow;
  onSuccess: () => void;
  short?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);

  //only used to open difference modal
  const [type, setType] = React.useState<number | undefined>();

  const assetCategories = useAssetCategories();

  const commonProps: ModalFormProps = {
    onSuccess: () => {
      onSuccess();
      reset();
    },
    open,
    onCancel: () => {
      reset();
    }
  };

  const reset = () => {
    setOpen(false);
    setType(undefined);
  };

  const shouldRenderAreaCreateBtn = !asset || isAssetAreaParent(asset);
  const shouldAssetCreationBtn = !asset || isAssetValidParent(asset);
  const both = shouldRenderAreaCreateBtn && shouldAssetCreationBtn;

  const AreaCreateBtn = () => {
    const { label } = area;
    const labelIntl = intl.get('CREATE_SOMETHING', { something: intl.get(label) });
    return (
      <>
        <IconButton
          icon={<PlusOutlined />}
          key={1}
          onClick={() => {
            setOpen(true);
            setType(1);
          }}
          tooltipProps={{
            title: labelIntl
          }}
          type='primary'
        />
        {type === 1 && <Create {...commonProps} parentId={asset?.id} />}
      </>
    );
  };

  const AssetCreationBtn = () => {
    const labelIntl = intl.get('CREATE_SOMETHING', { something: intl.get('ASSET') });
    return (
      <>
        <IconButton
          icon={<PlusOutlined />}
          key={2}
          onClick={() => {
            setOpen(true);
            setType(2);
          }}
          tooltipProps={{ title: labelIntl }}
          type={both ? 'default' : 'primary'}
        />
        {type === 2 && (
          <CreateAsset {...commonProps} parentId={asset?.id} types={assetCategories} />
        )}
      </>
    );
  };

  return (
    <>
      {shouldRenderAreaCreateBtn && <AreaCreateBtn />}
      {!short && shouldAssetCreationBtn && <AssetCreationBtn />}
    </>
  );
};
