import React from 'react';
import { Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../components/modalWrapper';
import { ModalFormProps } from '../../types/common';
import { SelectFormItem, TextFormItem } from '../../components';
import { addMonitoringPoints, Asset, AssetRow, MonitoringPointBatch } from '../../asset-common';
import { useMonitoringPointParents } from '../../asset-variant';
import { monitoringPointTypes, useSelectPoints } from './common';
import { PointItemList } from './pointItemList';

export const Create = (props: ModalFormProps & { asset?: AssetRow }) => {
  const { asset, onSuccess } = props;
  const [form] = Form.useForm<MonitoringPointBatch>();
  const [type, setType] = React.useState<number | undefined>();
  const { selectedPoints, setSelectPoints } = useSelectPoints(form);

  const handleTypeChange = (type: number) => {
    setType(type);
    form.setFieldsValue({
      monitoring_points: []
    });
  };

  return (
    <ModalWrapper
      {...{
        afterClose: () => {
          form.resetFields();
          setSelectPoints([]);
        },
        title: intl.get('CREATE_SOMETHING', { something: intl.get('monitoring.points') }),
        okText: intl.get('CREATE'),
        ...props,
        width: 500,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              addMonitoringPoints({
                monitoring_points: values.monitoring_points.map(({ dev_id, name, attributes }) => {
                  const process_id = 1;
                  const device_binding = { device_id: dev_id, process_id };
                  return {
                    name,
                    type: values.type,
                    attributes,
                    device_binding,
                    asset_id: values.asset_id
                  };
                })
              }).then(() => {
                onSuccess();
              });
            } catch (error) {
              console.log(error);
            }
          });
        }
      }}
    >
      <Form form={form} layout='vertical'>
        <ParentSelection asset={asset} />
        <TypeSelection onChange={handleTypeChange} />
        {type && (
          <PointItemList
            onSelect={setSelectPoints}
            onRemove={(index) => setSelectPoints((prev) => prev.filter((p, i) => index !== i))}
            initialSelected={selectedPoints}
            type={type}
          />
        )}
      </Form>
    </ModalWrapper>
  );
};

const isVaidParent = (asset?: AssetRow) => {
  return asset && Asset.Assert.isVibrationRelated(asset.type) ? true : false;
};

function ParentSelection({ asset }: { asset?: AssetRow }) {
  const parents = useMonitoringPointParents(isVaidParent, asset);

  if (isVaidParent(asset)) {
    return <TextFormItem name='asset_id' hidden={true} initialValue={asset?.id} />;
  } else {
    return (
      <SelectFormItem
        label='ASSET'
        name='asset_id'
        rules={[{ required: true }]}
        selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
      />
    );
  }
}

function TypeSelection({ onChange }: { onChange: (id: number) => void }) {
  return (
    <SelectFormItem
      label='TYPE'
      name='type'
      rules={[{ required: true }]}
      selectProps={{
        onChange,
        options: monitoringPointTypes.map(({ id, label }) => ({
          label: intl.get(label),
          value: id
        }))
      }}
    />
  );
}
