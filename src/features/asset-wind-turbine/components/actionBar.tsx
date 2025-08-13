import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { AssetRow } from '../../../asset-common';
import { useDescendentTypes } from '../utils';
import { wind, flange, tower } from '../constants';
import * as Wind from '../create';
import * as Flange from '../flange';
import * as Tower from '../tower';
import * as MonitoringPoint from '../../monitoring-point-wind-turbine';
import { IconButton } from '../../../components';

export const ActionBar = ({
  asset,
  onSuccess,
  short = false
}: {
  asset?: AssetRow;
  onSuccess: () => void;
  short?: boolean;
}) => {
  const descendent = useDescendentTypes(asset?.type);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<number | undefined>();

  const commonProps: ModalFormProps = {
    onSuccess: () => {
      onSuccess();
      reset();
    },
    open,
    onCancel: () => reset()
  };

  const reset = () => {
    setOpen(false);
    setType(undefined);
  };
  const hasFlangeAndTower = () => {
    const types = descendent.map(({ type }) => type);
    return types.includes(flange.type) && types.includes(tower.type);
  };

  return (
    <>
      {descendent
        .filter((_, i) => (short ? i === 0 : true))
        .map(({ type, label }) => {
          const labelIntl = intl.get('CREATE_SOMETHING', { something: intl.get(label) });
          return (
            <IconButton
              key={type}
              icon={<PlusOutlined />}
              onClick={() => {
                setOpen(true);
                setType(type);
              }}
              tooltipProps={{ title: labelIntl }}
              type={type === flange.type ? 'primary' : hasFlangeAndTower() ? 'default' : 'primary'}
            />
          );
        })}
      {type === wind.type && <Wind.Create {...commonProps} />}
      {type === flange.type && <Flange.Create {...commonProps} windId={asset?.id} />}
      {type === tower.type && <Tower.Create {...commonProps} windId={asset?.id} />}
      {type === 99999 && <MonitoringPoint.Create {...commonProps} asset={asset} />}
    </>
  );
};
