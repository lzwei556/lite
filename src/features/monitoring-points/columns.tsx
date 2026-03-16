import { ASSET_PATHNAME, AssetStatusTag } from 'asset-common';
import { MonitoringPoint, MonitoringPointType, CharacteristicData } from 'common';
import { Link } from 'components';
import { getDisplayName } from 'locales/utils';
import { useI18n } from 'providers/i18n';
import { Translation } from 'locales/utils';
import { getValue } from 'utils';

const name = {
  title: () => Translation.get('common.name'),
  dataIndex: 'name',
  key: 'name',
  render: (name: string, row: MonitoringPoint) => (
    <Link
      style={{ display: 'inline-block', minWidth: 120 }}
      to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`}
      key={`${row.id}-${row.type}`}
    >
      {name}
    </Link>
  )
};

const status = {
  title: () => Translation.get('common.status'),
  dataIndex: 'alertLevel',
  key: 'alertLevel',
  render: (level: number) => <AssetStatusTag status={level} />
};

const sensor = {
  title: () => Translation.get('device.sensor'),
  dataIndex: 'devices',
  key: 'devices',
  render: (_: string, row: MonitoringPoint) => {
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

export const usePropertyColumns = (point: MonitoringPoint) => {
  const { language } = useI18n();
  return MonitoringPointType.Key.getProperties(point.type, point.properties)
    .map((property) => ({
      ...property,
      fields: CharacteristicData.appendVibrationDirectionAbbrToField(
        property.fields,
        point.attributes
      )
    }))
    .map(({ fields = [], first, key, name, precision, unit }) => {
      const children = fields.map(({ alias, key, name }) => ({
        key,
        render: (d: MonitoringPoint) =>
          getValue({ value: d?.data?.values[key] as number, precision }),
        title: alias ? Translation.get(alias) : Translation.get(name)
      }));
      const title = getDisplayName({ name: Translation.get(name), lang: language, suffix: unit });
      return children.length > 1 && fields.length === children.length
        ? { key, title, children, hidden: !first }
        : {
            key,
            render: (d: MonitoringPoint) =>
              getValue({ value: d?.data?.values[key] as number, precision }),
            title,
            hidden: !first
          };
    });
};
