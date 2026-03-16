import React from 'react';
import { Col, Form } from 'antd';
import { Translation } from 'locales/utils';
import { Card, RadioFormItem, SaveIconButton, SelectFormItem } from '../../components';
import { generateColProps } from '../../utils/grid';
import { AssetModel, AssetRow, updateAsset } from '../../asset-common';
import { BasisFormItems, SettingFormItems } from '../../asset-variant';
import { CanAccess, Permission } from '../../providers/access-control';
import { AssetCategory } from '../../asset-category';
import { useFormItemBindingsProps } from 'hooks';
import { ENV } from 'utils';
import { buildPeriodOption } from 'locales/utils';

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
      title={Translation.get('common.basic')}
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
                          { label: 'diagnosis.period.real', value: 0 },
                          buildPeriodOption(1, 'hour'),
                          buildPeriodOption(2, 'hour'),
                          buildPeriodOption(4, 'hour'),
                          buildPeriodOption(8, 'hour'),
                          buildPeriodOption(12, 'hour'),
                          buildPeriodOption(24, 'hour')
                        ].map((opt) => ({
                          label:
                            typeof opt.label === 'object'
                              ? Translation.get(...opt.label)
                              : Translation.get(opt.label),
                          value: opt.value
                        }))
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
