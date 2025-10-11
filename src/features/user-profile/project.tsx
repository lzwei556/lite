import React from 'react';
import { Select } from 'antd';
import { createStyles } from 'antd-style';
import { useProjectsSelectProps } from '../../providers/user-profile';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles(({ css }) => ({
  select: css`
    .ant-select-selector .ant-select-selection-item,
    .ant-select-arrow {
      color: #fff;
    }
  `
}));

export const ProjectsSelect = () => {
  const navigate = useNavigate();
  const props = useProjectsSelectProps(() => navigate('/'));
  const className = useStyles().styles.select;
  return props && <Select {...props} className={className} />;
};
