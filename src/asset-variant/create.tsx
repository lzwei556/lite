import React from 'react';
import { Col, Form } from 'antd';
import { ModalWrapper } from '../components/modalWrapper';
import { ModalFormProps } from '../types/common';
import { Card, Grid, SelectFormItem, TextFormItem } from '../components';
import { generateColProps } from '../utils/grid';
import { addAsset, AssetCategory, AssetModel } from '../asset-common';
import { SettingFormItems } from './settingFormItems';
import { useParents } from './utils';
import { TypeFormItem } from './typeFormItem';
import { Translation } from 'locales/utils';

export const Create = (
  props: Omit<ModalFormProps, 'onSuccess'> & {
    parentId?: number;
    types: AssetCategory[];
    onSuccess: (type?: number) => void;
  }
) => {
  const { onSuccess, parentId, types } = props;
  const [form] = Form.useForm<AssetModel>();
  const [type, setType] = React.useState<number | undefined>();
  const label = 'asset';
  const parents = useParents();

  const renderParent = () => {
    if (parentId) {
      return <TextFormItem name='parent_id' hidden initialValue={parentId} />;
    } else if (parents.length >= 0) {
      return (
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <SelectFormItem
            label={label}
            name='parent_id'
            rules={[{ required: true }]}
            selectProps={{ options: parents.map(({ id, name }) => ({ label: name, value: id })) }}
          />
        </Col>
      );
    }
  };

  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: Translation.createSth(label),
        okText: Translation.get('common.action.create'),
        ...props,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              addAsset(values).then(() => {
                onSuccess(values.type);
              });
            } catch (error) {
              console.log(error);
            }
          });
        },
        width: 600
      }}
    >
      <Form form={form} layout='vertical'>
        <Card style={{ marginBottom: 16 }} title={Translation.get('common.basic')}>
          <Grid>
            <Col {...generateColProps({ xl: 12, xxl: 12 })}>
              <TextFormItem
                label='common.name'
                name='name'
                rules={[{ required: true }, { min: 4, max: 50 }]}
              />
            </Col>
            {renderParent()}
            <Col {...generateColProps({ xl: 12, xxl: 12 })}>
              <TypeFormItem onChange={setType} types={types} />
            </Col>
          </Grid>
        </Card>
        {type && (
          <SettingFormItems
            key={type}
            type={type}
            specialFormItemColProps={{ 'vel_base.vel_base_1_10X': generateColProps({}) }}
          />
        )}
      </Form>
    </ModalWrapper>
  );
};
