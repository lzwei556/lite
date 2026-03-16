import React from 'react';
import { Form } from 'antd';
import { Translation } from 'locales/utils';
import { ModalWrapper } from '../../components/modalWrapper';
import { ModalFormProps } from '../../types/common';
import { addMonitoringPoints, AssetRow, MonitoringPointBatch } from '../../asset-common';
import {
  getMonitoringPointTypes,
  getProcessId,
  isParentValid,
  useParents,
  useSelectPoints
} from './common';
import { PointItemList } from './pointItemList';
import { SelectFormItem, TextFormItem } from '../../components';

export const Create = (props: ModalFormProps & { asset?: AssetRow }) => {
  const { asset, onSuccess } = props;
  const [form] = Form.useForm<MonitoringPointBatch>();
  const [parent, setParent] = React.useState<AssetRow | undefined>(asset);
  const [type, setType] = React.useState<number | undefined>();
  const { selectedPoints, setSelectPoints } = useSelectPoints(
    form,
    Translation.get('device.channel')
  );

  const reloadTypes = (asset?: AssetRow) => {
    if (asset) {
      const types = getMonitoringPointTypes(asset);
      const type = form.getFieldValue('type') as number | undefined;
      if (type && !types.map(({ value }) => value).includes(type) && types.length > 0) {
        form.setFieldValue('type', types[0].value);
        handleTypeChange(types[0].value);
      }
    }
  };

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
        title: Translation.createSth('monitoring.points'),
        okText: Translation.get('common.action.create'),
        ...props,
        width: 500,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              addMonitoringPoints({
                monitoring_points: values.monitoring_points.map(
                  ({ dev_id, name, channel, attributes }) => {
                    const process_id = getProcessId(values.type, !!channel);
                    const device_binding =
                      channel !== undefined
                        ? { device_id: dev_id, process_id, parameters: { channel } }
                        : { device_id: dev_id, process_id };
                    return {
                      name,
                      type: values.type,
                      attributes,
                      device_binding,
                      asset_id: values.asset_id
                    };
                  }
                )
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
        <ParentSelection
          asset={asset}
          onChange={(asset) => {
            setParent(asset);
            reloadTypes(asset);
          }}
        />
        {parent && <TypeSelection parent={parent} key={parent.id} onChange={handleTypeChange} />}
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

function ParentSelection({
  asset,
  onChange
}: {
  asset?: AssetRow;
  onChange: (asset?: AssetRow) => void;
}) {
  const parents = useParents(asset);

  if (isParentValid(asset)) {
    return <TextFormItem name='asset_id' hidden={true} initialValue={asset?.id} />;
  } else {
    return (
      <SelectFormItem
        label='asset'
        name='asset_id'
        rules={[{ required: true }]}
        selectProps={{
          onChange: (id: number) => onChange(parents.find((a) => a.id === id)),
          options: parents.map(({ id, name }) => ({ label: name, value: id }))
        }}
      />
    );
  }
}

function TypeSelection({ parent, onChange }: { parent: AssetRow; onChange: (id: number) => void }) {
  return (
    <SelectFormItem
      label='common.type'
      name='type'
      rules={[{ required: true }]}
      selectProps={{
        onChange,
        options: getMonitoringPointTypes(parent).map(({ value, label }) => ({
          label: Translation.get(label),
          value
        }))
      }}
    />
  );
}
