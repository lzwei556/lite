import React from 'react';
import { Button, Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { ModalFormProps } from '../../../../types/common';
import { Flex, Grid } from '../../../../components';
import { generateColProps } from '../../../../utils/grid';
import { Asset, AssetModel, AssetRow, updateAsset } from '../../../asset-common';
import { UpdateFormItems } from '../_updateFormItems';

export const Update = (props: ModalFormProps & { asset: AssetRow }) => {
  const { asset, onSuccess } = props;
  const [form] = Form.useForm<AssetModel>();

  return (
    <Grid style={{ marginTop: 16 }}>
      <Col {...generateColProps({ md: 12, lg: 12, xl: 12, xxl: 8 })}>
        <Form form={form} labelCol={{ span: 6 }} initialValues={{ ...Asset.convert(asset) }}>
          <UpdateFormItems asset={asset} />
          <Flex style={{ marginTop: 12 }}>
            <Button
              type='primary'
              onClick={() => {
                form.validateFields().then((values) => {
                  try {
                    const _values = {
                      ...values,
                      attributes: {
                        ...values.attributes,
                        monitoring_points_num: Number(values.attributes?.monitoring_points_num),
                        sub_type: Number(values.attributes?.sub_type),
                        initial_preload: Number(values.attributes?.initial_preload),
                        initial_pressure: Number(values.attributes?.initial_pressure)
                      }
                    };
                    updateAsset(asset.id, _values as any).then(onSuccess);
                  } catch (error) {
                    console.log(error);
                  }
                });
              }}
            >
              {intl.get('SAVE')}
            </Button>
          </Flex>
        </Form>
      </Col>
    </Grid>
  );
};
