import React from 'react';
import { Col, Form, Input, Select } from 'antd';
import intl from 'react-intl-universal';
import { ModalWrapper } from '../../components/modalWrapper';
import { FormInputItem } from '../../components/formInputItem';
import { ModalFormProps } from '../../types/common';
import { addAsset, AssetCategory, AssetModel } from '../asset-common';
import { SettingFormItems } from './settingFormItems';
import { getByType, useParents } from './utils';
import { TypeFormItem } from './typeFormItem';
import { Card, Grid } from '../../components';
import { generateColProps } from '../../utils/grid';

export const Create = (props: ModalFormProps & { parentId?: number; types: AssetCategory[] }) => {
  const { onSuccess, parentId, types } = props;
  const [form] = Form.useForm<AssetModel>();
  const [type, setType] = React.useState<number | undefined>();
  const label = intl.get('ASSET');
  const parents = useParents();

  const renderParent = () => {
    if (parentId) {
      return (
        <Form.Item name='parent_id' hidden={true} initialValue={parentId}>
          <Input />
        </Form.Item>
      );
    } else if (parents.length >= 0) {
      return (
        <Col {...generateColProps({ xl: 12, xxl: 12 })}>
          <Form.Item
            label={label}
            name='parent_id'
            rules={[
              {
                required: true,
                message: intl.get('PLEASE_SELECT_SOMETHING', { something: label })
              }
            ]}
          >
            <Select placeholder={intl.get('PLEASE_SELECT_SOMETHING', { something: label })}>
              {parents.map(({ id, name }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
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
              <FormInputItem
                label={intl.get('NAME')}
                name='name'
                requiredMessage={intl.get('PLEASE_ENTER_NAME')}
                lengthLimit={{ min: 4, max: 50, label: intl.get('NAME').toLowerCase() }}
              >
                <Input placeholder={intl.get('PLEASE_ENTER_NAME')} />
              </FormInputItem>
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
