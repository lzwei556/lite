import { Alert, Checkbox, Form } from 'antd';
import { AssetRow } from 'asset-common';
import { FaultType } from 'common';
import { CheckboxFormItem } from 'components';
import React from 'react';
import { Translation } from 'locales/utils';

export const DiagnosisMarksFormAlert = ({
  asset,
  onSubmit
}: {
  asset: AssetRow;
  onSubmit: (faults: number[]) => void;
}) => {
  const [form] = Form.useForm();
  return (
    <Alert
      banner={true}
      message={
        <Form form={form} layout='vertical' initialValues={asset}>
          <CheckboxFormItem
            label='fault.type'
            name={['marks', 'faults']}
            checkboxGroupProps={{
              children: FaultType.options.map(({ label, value }) => (
                <Checkbox value={value} key={value}>
                  {Translation.get(label)}
                </Checkbox>
              )),
              onChange: onSubmit
            }}
            style={{ marginBottom: 0 }}
          />
        </Form>
      }
      style={{ marginBottom: 16 }}
    />
  );
};
