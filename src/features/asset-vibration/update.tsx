import React from 'react';
import { Col, Form } from 'antd';
import intl from 'react-intl-universal';
import { Card, RadioFormItem, SaveIconButton, SelectFormItem } from '../../components';
import { generateColProps } from '../../utils/grid';
import { AssetModel, AssetRow, updateAsset } from '../../asset-common';
import { BasisFormItems, SettingFormItems } from '../../asset-variant';
import { CanAccess, Permission } from '../../providers/access-control';
import { AssetCategory } from '../../asset-category';
import { useFormItemBindingsProps } from 'hooks';
import { ENV } from 'utils';

export const Update = ({ asset, onSuccess }: { asset: AssetRow; onSuccess: () => void }) => {
  const { name, parentId, type } = asset;
  const [form] = Form.useForm<AssetModel>();
  const [enabled, setEnabled] = React.useState(asset.diagnosisIsEnabled);
  const diagnosisEnabledFormItemProps = useFormItemBindingsProps({
    name: 'diagnosis_is_enabled',
    label: 'diagnosis.enabled'
  });
  const diagnosisFormItemProps = useFormItemBindingsProps({
    name: 'diagnosis_period',
    label: 'diagnosis.period',
    initialValue: 0
  });
  const isLegacy = ENV.legacyEnabled === 'true';

  return (
    <Card
      extra={
        <CanAccess {...Permission.AssetEdit}>
          <SaveIconButton
            onClick={() => {
              form.validateFields().then((values) => {
                try {
                  updateAsset(asset.id, { ...values, type }).then(() => {
                    onSuccess();
                  });
                } catch (error) {
                  console.log(error);
                }
              });
            }}
          />
        </CanAccess>
      }
      styles={{ body: { overflowY: 'auto', maxHeight: 500 } }}
      title={intl.get('BASIC_INFORMATION')}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ...asset,
          diagnosis_is_enabled: asset.diagnosisIsEnabled,
          diagnosis_period: asset.diagnosisPeriod,
          name,
          parent_id: parentId,
          type
        }}
      >
        <BasisFormItems
          types={AssetCategory.vibrationAssetOptions}
          formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
          vibrationDiagnosis={
            !isLegacy && (
              <>
                <Col {...generateColProps({ xl: 12, xxl: 8 })}>
                  <RadioFormItem
                    {...diagnosisEnabledFormItemProps}
                    radioGroupProps={{ onChange: (e) => setEnabled(e.target.value) }}
                  />
                </Col>
                {enabled && (
                  <Col {...generateColProps({ xl: 12, xxl: 8 })}>
                    <SelectFormItem
                      {...diagnosisFormItemProps}
                      selectProps={{
                        options: [
                          { label: intl.get('diagnosis.period.real'), value: 0 },
                          { label: intl.get('OPTION_1_HOUR'), value: 60 * 60 },
                          { label: intl.get('OPTION_2_HOURS'), value: 2 * 60 * 60 },
                          { label: intl.get('OPTION_4_HOURS'), value: 4 * 60 * 60 },
                          { label: intl.get('OPTION_8_HOURS'), value: 8 * 60 * 60 },
                          { label: intl.get('OPTION_12_HOURS'), value: 12 * 60 * 60 },
                          { label: intl.get('OPTION_24_HOURS'), value: 24 * 60 * 60 }
                        ]
                      }}
                    />
                  </Col>
                )}
              </>
            )
          }
        />
        {type && (
          <SettingFormItems
            key={type}
            type={type}
            formItemColProps={generateColProps({ xl: 12, xxl: 8 })}
          />
        )}
      </Form>
    </Card>
  );
};
