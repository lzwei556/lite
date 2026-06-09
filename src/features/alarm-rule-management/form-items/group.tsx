import { Col, SelectProps } from 'antd';
import { FormItem, Grid } from 'components';
import { AlarmRuleGroupFields } from 'domains/alarm-rule';
import React from 'react';
import { generateColProps } from 'utils/grid';
import { toUniversalFormItemProps } from 'types';

export const GroupFormItems = (props: SelectProps) => {
  return (
    <Grid>
      <Col {...generateColProps({ xl: 12, xxl: 12 })}>
        <FormItem {...toUniversalFormItemProps({ field: AlarmRuleGroupFields.Name })} />
      </Col>
      <Col {...generateColProps({ xl: 12, xxl: 12 })}>
        <FormItem
          {...toUniversalFormItemProps({ field: AlarmRuleGroupFields.Type })}
          selectProps={props}
        />
      </Col>
      <Col {...generateColProps({})}>
        <FormItem {...toUniversalFormItemProps({ field: AlarmRuleGroupFields.Description })} />
      </Col>
    </Grid>
  );
};
