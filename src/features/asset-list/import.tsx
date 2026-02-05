import { message } from 'antd';
import { importAssets } from 'asset-common';
import { JsonImporter } from 'components';
import { CanAccess, Permission } from 'providers/access-control';
import { useSelectedProject } from 'providers/user-profile';
import React from 'react';
import intl from 'react-intl-universal';
import { useGlobalStyles } from 'styles';

export const ImportButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { colorPrimaryHoverStyle } = useGlobalStyles();
  const selectedProject = useSelectedProject();
  return (
    selectedProject && (
      <CanAccess {...Permission.AssetImport}>
        <JsonImporter
          iconButtonProps={{
            style: {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderInlineStartColor: colorPrimaryHoverStyle.color
            }
          }}
          onUpload={(data) => {
            return importAssets(selectedProject.id, data).then((res) => {
              if (res.data.code === 200) {
                message.success(intl.get('IMPORTED_SUCCESSFUL'));
                onSuccess();
              } else {
                message.error(`${intl.get('FAILED_TO_IMPORT')}: ${res.data.msg}`);
              }
            });
          }}
        />
      </CanAccess>
    )
  );
};
