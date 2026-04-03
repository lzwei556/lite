import { AssetStatusTag } from 'asset-common';
import { Link } from 'components';
import { AssetTree } from 'domain/asset';
import { FeatureProperty } from 'domain/feature-property';
import { TMonitoringPoint, OMonitoringPoint } from 'domain/monitoring-point';
import { useLocaleContext } from 'localeProvider';
import intl from 'react-intl-universal';
import { getDisplayName, getValue } from 'utils';

const name = {
  title: () => intl.get('NAME'),
  dataIndex: 'name',
  key: 'name',
  render: (name: string, row: TMonitoringPoint.Base) => (
    <Link
      style={{ display: 'inline-block', minWidth: 120 }}
      to={`/${AssetTree.Path.Assets}/${row.id}-${row.type}`}
      key={`${row.id}-${row.type}`}
    >
      {name}
    </Link>
  )
};

const status = {
  title: () => intl.get('STATUS'),
  dataIndex: 'alertLevel',
  key: 'alertLevel',
  render: (level: number) => <AssetStatusTag status={level} />
};

const sensor = {
  title: () => intl.get('SENSOR'),
  dataIndex: 'devices',
  key: 'devices',
  render: (_: string, row: TMonitoringPoint.Base) => {
    if (row.device) {
      const { id, name } = row.device;
      return (
        <Link style={{ display: 'inline-block', minWidth: 120 }} to={`/devices/${id}`} key={id}>
          {name}
        </Link>
      );
    } else {
      return '-';
    }
  }
};

export const basicFieldColumns = [name, status, sensor];

export const usePropertyColumns = (point: TMonitoringPoint.Base) => {
  const { language } = useLocaleContext();
  return OMonitoringPoint.Type.getProperties(point)
    .map((property) => ({
      ...property,
      fields: FeatureProperty.appendVibrationDirectionAbbr(property.fields, point.attributes)
    }))
    .map(({ fields = [], first, key, name, precision, unit }) => {
      const children = fields.map(({ alias, key, name }) => ({
        key,
        render: (d: TMonitoringPoint.Base) =>
          getValue({ value: d?.data?.values[key] as number, precision }),
        title: alias ? intl.get(alias) : intl.get(name)
      }));
      const title = getDisplayName({ name: intl.get(name), lang: language, suffix: unit });
      return children.length > 1 && fields.length === children.length
        ? { key, title, children, hidden: !first }
        : {
            key,
            render: (d: TMonitoringPoint.Base) =>
              getValue({ value: d?.data?.values[key] as number, precision }),
            title,
            hidden: !first
          };
    });
};
