import React from 'react';
import { TableProps } from 'antd';
import intl from 'react-intl-universal';
import { MonitoringPointTypeValue } from '../../../../config';
import { Dayjs } from '../../../../utils';
import { Link } from '../../../../components';
import { getDisplayName, getValue, roundValue } from '../../../../utils/format';
import { Language } from '../../../../localeProvider';
import { ASSET_PATHNAME } from '../../constants';
import { AssetStatusTag } from '../../assetStatusTag';
import { MonitoringPointRow } from '../types';
import { Point } from '../util';
import { AXIS_ALIAS } from '../constants';
import { OperateCell } from './operateCell';

export type Column = Required<TableProps<MonitoringPointRow>>['columns'][0];

const name = {
  title: () => intl.get('NAME'),
  dataIndex: 'name',
  key: 'name',
  width: 240,
  render: (name: string, row: MonitoringPointRow) => (
    <Link to={`/${ASSET_PATHNAME}/${row.id}-${row.type}`} key={`${row.id}-${row.type}`}>
      {name}
    </Link>
  )
};

const status = {
  title: () => intl.get('STATUS'),
  dataIndex: 'alertLevel',
  key: 'alertLevel',
  width: 120,
  render: (level: number) => <AssetStatusTag status={level} />
};

const sensor = {
  title: () => intl.get('SENSOR'),
  dataIndex: 'devices',
  key: 'devices',
  width: 120,
  render: (name: string, row: MonitoringPointRow) =>
    row.bindingDevices && row.bindingDevices.length > 0
      ? row.bindingDevices.map(({ id, name }) => (
          <Link to={`/devices/${id}`} key={id}>
            {name}
          </Link>
        ))
      : ''
};
const time = {
  title: () => intl.get('SAMPLING_TIME'),
  key: 'timestamp',
  render: (time: string, row: MonitoringPointRow) => {
    return row.data && row.data.timestamp ? Dayjs.format(row.data.timestamp) : '-';
  },
  width: 120
};

export const positionColumn = {
  title: () => intl.get('POSITION'),
  key: 'position',
  render: (name: string, row: MonitoringPointRow) => row.attributes?.index ?? '-'
};
export type OperateCellProps = {
  onDeleteSuccess: (id: number) => void;
  onUpdate: (point: MonitoringPointRow) => void;
};
export const getOperateColumn = ({ onDeleteSuccess, onUpdate }: OperateCellProps) => ({
  title: () => intl.get('OPERATION'),
  key: 'action',
  render: (_: string, point: MonitoringPointRow) => (
    <OperateCell {...{ onDeleteSuccess, onUpdate, point }} />
  )
});
export const installAngle = {
  title: () => intl.get('TOWER_INSTALL_ANGLE'),
  key: 'install.angle',
  render: (_: string, row: MonitoringPointRow) => row.attributes?.tower_install_angle ?? '-'
};

export const installHeight = {
  title: () => intl.get('TOWER_INSTALL_HEIGHT'),
  key: 'install.height',
  render: (_: string, row: MonitoringPointRow) => row.attributes?.tower_install_height ?? '-'
};

export const installRadius = {
  title: () => intl.get('TOWER_BASE_RADIUS'),
  key: 'install.radius',
  render: (_: string, row: MonitoringPointRow) => row.attributes?.tower_base_radius ?? '-'
};

function getPropertyedCols(
  measurement: MonitoringPointRow,
  lang: Language,
  needToFilterFirstProperties = false
): Column[] {
  if (!measurement) return [];
  const properties = Point.getPropertiesByType(measurement.properties, measurement.type).filter(
    (p) => (needToFilterFirstProperties ? p.first : true)
  );
  return properties.map(({ fields = [], first, key, name, precision, unit }) => {
    let children = fields.map(({ key: subKey, name }) => {
      const axisKey = subKey.replace(`${key}_`, '');
      const axis = Point.getAxis(axisKey);
      return {
        key: subKey,
        render: (d: MonitoringPointRow) =>
          getValue(roundValue(d?.data?.values[subKey] as number, precision)),
        title: axis ? intl.get(axis.label) : intl.get(name),
        width: 90
      };
    });
    if (
      measurement.type === MonitoringPointTypeValue.Vibration ||
      measurement.type === MonitoringPointTypeValue.VibrationRotation
    ) {
      children = Object.values(AXIS_ALIAS).map(({ key: aliasKey, label }) => {
        return {
          key: aliasKey,
          render: (d: MonitoringPointRow) => {
            const attrs = d.attributes;
            const axisKey = attrs?.[aliasKey];
            return getValue(roundValue(d?.data?.values[`${key}_${axisKey}`] as number, precision));
          },
          title: intl.get(label),
          width: 90
        };
      });
    }
    const title = getDisplayName({ name: intl.get(name), lang, suffix: unit });
    return children.length > 1 && fields.length === children.length
      ? { key, title, children, hidden: !first }
      : {
          key,
          render: (d: MonitoringPointRow) =>
            getValue(roundValue(d?.data?.values[key] as number, precision)),
          title,
          width: 120,
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
  language: Language;
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
