import React from 'react';
import { FormItemProps, Slider, SliderSingleProps } from 'antd';
import { TextFormItem } from './textFormItem';
import { SliderRangeProps } from 'antd/es/slider';

export type SliderFromItemProps = FormItemProps & {
  sliderProps?: SliderSingleProps | SliderRangeProps;
};

export const SliderFormItem = (props: SliderFromItemProps) => {
  const { sliderProps, ...rest } = props;

  return (
    <TextFormItem {...rest}>
      <Slider {...sliderProps} />
    </TextFormItem>
  );
};
