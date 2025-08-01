import * as React from 'react';
import { Checkbox, Col, Empty, Form, Input, ModalProps, Row, Select, Spin } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../../components/modalWrapper';
import { AssetRow, getAssets, MONITORING_POINT } from '../../asset-common';
import { area } from '../../asset-variant';
import { wind } from '../../app-wind-turbine/constants';
import { bindMeasurementsToAlarmRule2 } from './services';
import { AlarmRule } from './types';
import { MonitoringPointTypeValue } from '../../../config';
import { TextFormItem } from '../../../components';

type MixinAssetRow = AssetRow & {
  pointIds: number[];
  checked: boolean;
  indeterminate: boolean;
  selected: boolean;
};

export const BindMonitoringPoints: React.FC<
  ModalProps & { selectedRow: AlarmRule } & { onSuccess: () => void }
> = (props) => {
  const [form] = Form.useForm();
  const [assets, setAssets] = React.useState<MixinAssetRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const selectedAsset = assets.find((a) => a.selected);

  React.useEffect(() => {
    const getPointIds = (asset: AssetRow) => {
      const pointIds: number[] = [];
      if (asset.children && asset.children.length > 0) {
        asset.children.forEach((sub) => {
          if (sub.monitoringPoints && sub.monitoringPoints.length > 0) {
            pointIds.push(
              ...sub.monitoringPoints
                .filter((m) => m.type === props.selectedRow.type)
                .map(({ id }) => id)
            );
          }
          if (sub.children && sub.children.length > 0) {
            sub.children.forEach((c) => pointIds.push(...getPointIds(c)));
          }
        });
      }
      if (asset.monitoringPoints && asset.monitoringPoints.length > 0) {
        pointIds.push(
          ...asset.monitoringPoints
            .filter((m) => m.type === props.selectedRow.type)
            .map(({ id }) => id)
        );
      }
      return pointIds;
    };
    getAssets({ parent_id: 0 }).then((data) => {
      setLoading(false);
      const assets = data
        .filter((asset) => {
          if (
            props.selectedRow.type === MonitoringPointTypeValue.BoltLoosening ||
            props.selectedRow.type === MonitoringPointTypeValue.BoltPreload ||
            props.selectedRow.type === MonitoringPointTypeValue.AnchorPreload ||
            props.selectedRow.type === MonitoringPointTypeValue.BaseInclination ||
            props.selectedRow.type === MonitoringPointTypeValue.TopInclination
          ) {
            return asset.type === wind.type;
          } else {
            return asset.type === area.type;
          }
        })
        .map((asset, i) => {
          const pointIds = getPointIds(asset);
          const initialIds = (props.selectedRow.monitoringPoints || [])
            .map(({ id }) => id)
            .filter((id) => pointIds.includes(id));
          if (initialIds.length > 0)
            form.setFieldsValue({
              [`${asset.id}`]: { ids: initialIds }
            });
          return {
            ...asset,
            checked: pointIds.length === initialIds.length,
            indeterminate: (initialIds.length && initialIds.length < pointIds.length) || false,
            pointIds,
            selected: i === 0
          };
        });
      setAssets(assets);
    });
  }, [props.selectedRow, form]);

  const updateAssets = (asset: MixinAssetRow, checked: boolean, indeterminate: boolean) => {
    setAssets((prev) =>
      prev.map((item) => {
        if (item.id === asset.id) {
          return {
            ...item,
            checked,
            indeterminate
          };
        } else {
          return item;
        }
      })
    );
  };

  const renderMonitoringPoint = (asset: AssetRow) => {
    const { id, name, monitoringPoints } = asset;
    if (monitoringPoints && monitoringPoints.some(({ type }) => type === props.selectedRow.type)) {
      return (
        <React.Fragment key={id}>
          <Col span={24}>{name}</Col>
          <Col span={24}>
            <Row>
              {monitoringPoints &&
                monitoringPoints.map(({ id, name, type }) => {
                  if (type === props.selectedRow.type) {
                    return (
                      <Col key={id} span={8}>
                        <Checkbox value={id}>{name}</Checkbox>
                      </Col>
                    );
                  } else {
                    return null;
                  }
                })}
            </Row>
          </Col>
        </React.Fragment>
      );
    } else {
      return null;
    }
  };

  const renderAsset = (asset: AssetRow): React.ReactNode => {
    const { monitoringPoints, children } = asset;
    if (children && children.length > 0) {
      return children.map((a) => renderMonitoringPoint(a));
    } else if (monitoringPoints && monitoringPoints.length > 0) {
      return renderMonitoringPoint(asset);
    } else {
      return null;
    }
  };

  const renderModalContent = () => {
    if (loading) return <Spin />;
    if (assets.length === 0 || !selectedAsset)
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return (
      <>
        <TextFormItem>
          <Input.Group>
            {selectedAsset && (
              <Checkbox
                key={selectedAsset.id}
                onChange={(e) => {
                  form.setFieldsValue({
                    [`${selectedAsset.id}`]: { ids: e.target.checked ? selectedAsset.pointIds : [] }
                  });
                  updateAssets(selectedAsset, e.target.checked, false);
                }}
                checked={selectedAsset.checked}
                indeterminate={selectedAsset.indeterminate}
              >
                {intl.get('SELECT_ALL')}
              </Checkbox>
            )}
            <Select
              onChange={(val) =>
                setAssets((prev) => prev.map((asset) => ({ ...asset, selected: asset.id === val })))
              }
              defaultValue={assets[0].id}
              style={{ width: '50%', marginLeft: '1em' }}
            >
              {assets.map(({ id, name }) => (
                <Select.Option value={id} key={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Input.Group>
        </TextFormItem>
        {assets.map(({ id, children }) => (
          <div key={id} style={{ display: selectedAsset.id === id ? 'block' : 'none' }}>
            <TextFormItem name={[`${id}`, 'ids']}>
              <Checkbox.Group
                style={{ width: '100%' }}
                onChange={(e) => {
                  updateAssets(
                    selectedAsset,
                    selectedAsset.pointIds.length === e.length,
                    (e.length && e.length < selectedAsset.pointIds.length) || false
                  );
                }}
              >
                <Row key={id} gutter={[0, 16]} style={{ marginBottom: 16, width: '100%' }}>
                  {children?.map((asset) => renderAsset(asset))}
                </Row>
              </Checkbox.Group>
            </TextFormItem>
          </div>
        ))}
      </>
    );
  };

  return (
    <ModalWrapper
      afterClose={() => form.resetFields()}
      width={800}
      title={intl.get('EDIT_SOMETHING', { something: intl.get(MONITORING_POINT) })}
      {...props}
      okButtonProps={{ disabled: assets.length === 0 }}
      okText={intl.get('SAVE')}
      onOk={() => {
        form.validateFields().then((values) => {
          const monitoring_point_ids: number[] = [];
          Object.values(values)
            .filter((value: any) => value.ids !== undefined)
            .forEach(({ ids }: any) => monitoring_point_ids.push(...ids));
          if (monitoring_point_ids.length === 0) props.onSuccess();
          if (monitoring_point_ids) {
            bindMeasurementsToAlarmRule2(props.selectedRow.id, { monitoring_point_ids }).then(() =>
              props.onSuccess()
            );
          }
        });
      }}
    >
      <Form form={form}>{renderModalContent()}</Form>
    </ModalWrapper>
  );
};
