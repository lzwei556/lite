import React from 'react';
import { Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../types/common';
import { ModalWrapper } from '../../../components/modalWrapper';
import { generateColProps } from '../../../utils/grid';
import { Grid, SelectFormItem, TextFormItem } from '../../../components';
import { addAsset, AssetModel, useContext } from '../../asset-common';
import { useParentTypes } from '../utils';
import { wind, tower } from '../constants';

export const Create = (props: ModalFormProps & { windId?: number }) => {
  const { onSuccess, windId } = props;
  const [form] = Form.useForm<AssetModel>();
  const { label } = wind;
  const { type } = tower;
  const { assets } = useContext();
  const parentTypes = useParentTypes(type);
  const formItemColProps = generateColProps({});
  const winds = windId
    ? []
    : assets.filter((a) => parentTypes.map(({ type }) => type).includes(a.type));

  const renderParent = () => {
    if (windId) {
      return <TextFormItem name='parent_id' hidden={true} initialValue={windId} />;
    } else if (winds.length >= 0) {
      return (
        <Col {...formItemColProps}>
          <SelectFormItem
            label={label}
            name='parent_id'
            rules={[{ required: true }]}
            selectProps={{ options: winds.map(({ id, name }) => ({ label: name, value: id })) }}
          />
        </Col>
      );
    }
  };

  return (
    <ModalWrapper
      {...{
        afterClose: () => form.resetFields(),
        title: intl.get('CREATE_SOMETHING', { something: intl.get(tower.label) }),
        okText: intl.get('CREATE'),
        ...props,
        onOk: () => {
          form.validateFields().then((values) => {
            try {
              addAsset(values).then(onSuccess);
            } catch (error) {
              console.log(error);
            }
          });
        }
      }}
    >
      <Form form={form} layout='vertical' initialValues={{ type, attributes: { index: 1 } }}>
        <Grid>
          <Col {...formItemColProps}>
            <TextFormItem
              label='NAME'
              name='name'
              rules={[{ required: true }, { min: 4, max: 50 }]}
            />
          </Col>
        </Grid>
        <TextFormItem name='type' hidden={true} />
        {renderParent()}
        <Col {...formItemColProps}>
          <SelectFormItem
            label='INDEX_NUMBER'
            name={['attributes', 'index']}
            selectProps={{ options: [1, 2, 3, 4, 5].map((value) => ({ label: value, value })) }}
          />
        </Col>
      </Form>
    </ModalWrapper>
  );
};
