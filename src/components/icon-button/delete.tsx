import React from 'react';
import { ButtonProps, Popconfirm, PopconfirmProps, TooltipProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import { IconButton } from './button';

export const DeleteIconButton = (props: {
  confirmProps: Omit<PopconfirmProps, 'title'> & { title?: PopconfirmProps['title'] };
  buttonProps?: ButtonProps;
  tooltipProps?: TooltipProps;
}) => {
  const {
    okText = intl.get('DELETE'),
    placement = 'bottom',
    title: confirmTitle = intl.get('DELETE'),
    description,
    ...popRestProps
  } = props.confirmProps;
  const {
    title = intl.get('DELETE'),
    placement: tooltipPlacement = 'right',
    ...restTooltipProps
  } = props.tooltipProps || {};
  const {
    color = 'danger',
    variant = 'outlined',
    size = 'small',
    ...buttonRestProps
  } = props.buttonProps || {};

  const renderDescription = () => {
    if (!description) return description;
    const style = { paddingBlock: 8, minWidth: 200, maxWidth: 300 };
    if (typeof description === 'function') {
      return <div style={style}>{description()}</div>;
    } else {
      return <div style={style}>{description}</div>;
    }
  };

  return (
    <Popconfirm
      {...popRestProps}
      title={confirmTitle}
      description={renderDescription()}
      okText={okText}
      placement={placement}
    >
      <IconButton
        {...buttonRestProps}
        color={color}
        icon={<DeleteOutlined />}
        size={size}
        variant={variant}
        tooltipProps={{ ...restTooltipProps, title, placement: tooltipPlacement }}
      />
    </Popconfirm>
  );
};
