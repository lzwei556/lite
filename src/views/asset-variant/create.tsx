import React from 'react';
import { Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../components/modalWrapper';
import { ModalFormProps } from '../../types/common';
import { Card, Grid, SelectFormItem, TextFormItem } from '../../components';
import { generateColProps } from '../../utils/grid';
import { addAsset, AssetCategory, AssetModel } from '../asset-common';
import { SettingFormItems } from './settingFormItems';
import { getByType, useParents } from './utils';
import { TypeFormItem } from './typeFormItem';

export const Create = (props: ModalFormProps & { parentId?: number; types: AssetCategory[] }) => {
  const { onSuccess, parentId, types } = props;
  const [form] = Form.useForm<AssetModel>();
  const [type, setType] = React.useState<number | undefined>();
  const label = intl.get('ASSET');
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
        title: intl.get('CREATE_SOMETHING', { something: label }),
        okText: intl.get('CREATE'),
        ...props,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              addAsset(values).then(() => {
                onSuccess();
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
        <Card size='small' style={{ marginBlock: 16 }} title={intl.get('BASIC_INFORMATION')}>
          <Grid>
            <Col {...generateColProps({ xl: 12, xxl: 12 })}>
              <TextFormItem
                label='NAME'
                name='name'
                rules={[{ required: true }, { min: 4, max: 50 }]}
              />
            </Col>
            {renderParent()}
            <Col {...generateColProps({ xl: 12, xxl: 12 })}>
              <TypeFormItem
                onChange={(type) => {
                  setType(type);
                  form.setFieldsValue(getByType(type)?.settings?.default as any);
                }}
                types={types}
              />
            </Col>
          </Grid>
        </Card>
        {type && <SettingFormItems key={type} type={type} />}
      </Form>
    </ModalWrapper>
  );
};
