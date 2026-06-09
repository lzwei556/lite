import { AssetStatusTag } from 'asset-common';
import { Link } from 'components';
import { AssetTree } from 'domains/asset';
import * as Feature from 'domains/feature-property';
import * as MonitoringPoint from 'domains/monitoring-point';
import { useLocaleContext } from 'localeProvider';
import intl from 'react-intl-universal';
import { getDisplayName, getValue } from 'utils';

const name = {
  title: () => intl.get('NAME'),
  dataIndex: 'name',
  key: 'name',
  render: (name: string, row: MonitoringPoint.Types.Entity) => (
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
  render: (_: string, row: MonitoringPoint.Types.Entity) => {
    if (row.sensor) {
      const { id, name } = row.sensor;
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

export const usePropertyColumns = (point: MonitoringPoint.Types.Entity) => {
  const { language } = useLocaleContext();
  return MonitoringPoint.Type.getProperties(point)
    .map((property) => ({
      ...property,
      fields: Feature.Property.appendVibrationDirectionAbbr(property.fields, point.attributes)
    }))
    .map(({ fields = [], first, key, name, precision, unit }) => {
      const children = fields.map(({ alias, key, name }) => ({
        key,
        render: (d: MonitoringPoint.Types.Entity) =>
          getValue({ value: d?.data?.values[key] as number, precision }),
        title: alias ? intl.get(alias) : intl.get(name)
      }));
      const title = getDisplayName({ name: intl.get(name), lang: language, suffix: unit });
      return children.length > 1 && fields.length === children.length
        ? { key, title, children, hidden: !first }
        : {
            key,
            render: (d: MonitoringPoint.Types.Entity) =>
              getValue({ value: d?.data?.values[key] as number, precision }),
            title,
            hidden: !first
          };
    });
};
