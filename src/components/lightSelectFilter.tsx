import React from 'react';
import { Select, SelectProps, Typography } from 'antd';

export const LightSelectFilter = (props: SelectProps) => {
  const { allowClear = true, onChange, prefix, variant = 'outlined', ...rest } = props;
  const [val, setVal] = React.useState<string | string[] | number | number[]>(props.defaultValue);

  const getSelected = () => {
    if (props.value) {
      return true;
    }
    if (val) {
      if (Array.isArray(val) && val.length === 0) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  };

  return (
    <Select
      {...rest}
      allowClear={allowClear}
      className={getSelected() ? 'selected' : 'unselected'}
      onChange={(value, options) => {
        setVal(value);
        onChange?.(value, options);
      }}
      prefix={<Typography.Text type='secondary'>{prefix}</Typography.Text>}
      variant={variant}
    />
  );
};
