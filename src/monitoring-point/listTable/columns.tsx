import React from 'react';
import { TableProps } from 'antd';
import { Translation } from 'locales/utils';
import { Dayjs, getAttrValue } from '../../utils';
import { Link } from '../../components';
import { getValue } from '../../utils/format';
import { ASSET_PATHNAME, AssetStatusTag } from '../../asset-common';
import { MonitoringPointRow } from '../types';
import { Point } from '../util';
import { AXIS_ALIAS, TowerBaseRadius, TowerInstallAngle, TowerInstallHeight } from '../constants';
import { OperateCell } from './operateCell';
import { MonitoringPointType } from 'common';
import { getDisplayName } from 'locales/utils';
import { LanguageCode } from 'providers/i18n';

export type Column = Required<TableProps<MonitoringPointRow>>['columns'][0];

const name = {
  title: () => Translation.get('common.name'),
  dataIndex: 'name',
  key: 'name',
  render: (name: string, row: MonitoringPointRow) => (
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
  render: (_: string, row: MonitoringPointRow) =>
    row.bindingDevices && row.bindingDevices.length > 0
      ? row.bindingDevices.map(({ id, name }) => (
          <Link style={{ display: 'inline-block', minWidth: 120 }} to={`/devices/${id}`} key={id}>
            {name}
          </Link>
        ))
      : ''
};
const time = {
  title: () => Translation.get('device.data.timestamp'),
  key: 'timestamp',
  render: (_: string, row: MonitoringPointRow) => {
    return row.data && row.data.timestamp ? (
      <span style={{ display: 'inline-block', width: 150 }}>
        {Dayjs.format(row.data.timestamp)}
      </span>
    ) : (
      '-'
    );
  }
};

export const positionColumn = {
  title: () => Translation.get('monitoring.point.position'),
  key: 'position',
  render: (_: string, row: MonitoringPointRow) => getAttrValue(row.attributes, 'index')
};
export type OperateCellProps = {
  onDeleteSuccess: (id: number) => void;
  onUpdate: (point: MonitoringPointRow) => void;
};
export const getOperateColumn = ({ onDeleteSuccess, onUpdate }: OperateCellProps) => ({
  title: () => Translation.get('common.operation'),
  key: 'action',
  render: (_: string, point: MonitoringPointRow) => (
    <OperateCell {...{ onDeleteSuccess, onUpdate, point }} />
  )
});
export const getInstallAngleColumn = (lang: LanguageCode) => {
  return {
    title: () =>
      getDisplayName({
        name: Translation.get(TowerInstallAngle.label),
        lang,
        suffix: TowerInstallAngle.unit
      }),
    key: TowerInstallAngle.name,
    render: (_: string, row: MonitoringPointRow) =>
      getAttrValue(row.attributes, 'tower_install_angle')
  };
};
export const getInstallHeightColumn = (lang: LanguageCode) => {
  return {
    title: () =>
      getDisplayName({
        name: Translation.get(TowerInstallHeight.label),
        lang,
        suffix: TowerInstallHeight.unit
      }),
    key: TowerInstallHeight.name,
    render: (_: string, row: MonitoringPointRow) =>
      getAttrValue(row.attributes, 'tower_install_height')
  };
};
export const getBaseRadiusColumn = (lang: LanguageCode) => {
  return {
    title: () =>
      getDisplayName({
        name: Translation.get(TowerBaseRadius.label),
        lang,
        suffix: TowerBaseRadius.unit
      }),
    key: TowerBaseRadius.name,
    render: (_: string, row: MonitoringPointRow) =>
      getAttrValue(row.attributes, 'tower_base_radius')
  };
};

function getPropertyedCols(
  measurement: MonitoringPointRow,
  lang: LanguageCode,
  needToFilterFirstProperties = false
): Column[] {
  if (!measurement) return [];
  const properties = MonitoringPointType.Key.getProperties(
    measurement.type,
    measurement.properties
  ).filter((p) => (needToFilterFirstProperties ? p.first : true));
  return properties.map(({ fields = [], first, key, name, precision, unit }) => {
    let children = fields.map(({ key: subKey, name }) => {
      const axisKey = subKey.replace(`${key}_`, '');
      const axis = Point.getAxis(axisKey);
      return {
        key: subKey,
        render: (d: MonitoringPointRow) =>
          getValue({ value: d?.data?.values[subKey] as number, precision }),
        title: axis ? Translation.get(axis.label) : Translation.get(name)
      };
    });
    if (Point.Assert.isThreeAxisedVibrationRelated(measurement.type)) {
      children = Object.values(AXIS_ALIAS).map(({ key: aliasKey, abbr }) => {
        return {
          key: aliasKey,
          render: (d: MonitoringPointRow) => {
            const attrs = d.attributes;
            const axisKey = attrs?.[aliasKey];
            return getValue({
              value: d?.data?.values[`${key}_${axisKey}`] as number,
              precision
            });
          },
          title: Translation.get(abbr)
        };
      });
    }
    const title = getDisplayName({ name: Translation.get(name), lang, suffix: unit });
    return children.length > 1 && fields.length === children.length
      ? { key, title, children, hidden: !first }
      : {
          key,
          render: (d: MonitoringPointRow) =>
            getValue({ value: d?.data?.values[key] as number, precision }),
          title,
          hidden: !first
        };
  });
}

export function getColumns({
  language,
  more = true,
  operateCellProps,
  point
}: {
  language: LanguageCode;
  more?: boolean;
  operateCellProps?: OperateCellProps;
  point?: MonitoringPointRow;
}) {
  const columns: Column[] = [name];
  if (more) {
    columns.push(status);
    columns.push(sensor);
  }
  if (point) {
    columns.push(...getPropertyedCols(point, language));
    columns.push(time);
  }
  if (operateCellProps) {
    columns.push(getOperateColumn(operateCellProps));
  }
  return columns;
}
