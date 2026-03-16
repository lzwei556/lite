import * as React from 'react';
import { Checkbox, Form, ModalProps, Col, Button } from 'antd';
import { Translation } from 'locales/utils';
import { AssetRow, exportAssets } from '../../asset-common';
import { getFilename } from '../../utils/format';
import { ModalWrapper } from '../../components/modalWrapper';
import { Card, CheckboxFormItem, Grid } from '../../components';
import { useSelectedProject } from '../../providers/user-profile';
import { downloadFile } from 'utils';

export const SelectAssets: React.FC<{ assets: AssetRow[]; onSuccess: () => void } & ModalProps> = (
  props
) => {
  const [form] = Form.useForm();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(false);
  const selectedProject = useSelectedProject();

  const handleUpload = (windIds?: number[]) => {
    if (selectedProject) {
      exportAssets(selectedProject.id, windIds)
        .then((res) => {
          if (!windIds) props.onSuccess();
          downloadFile(window.URL.createObjectURL(new Blob([res.data])), getFilename(res));
        })
        .finally(() => {
          setLoading(false);
          form.resetFields();
          setSelected([]);
        });
    }
  };

  return (
    <ModalWrapper
      {...props}
      afterClose={() => form.resetFields()}
      title={Translation.get('common.action.export')}
      footer={[
        <Button key='back' onClick={(e) => props.onCancel && props.onCancel(e as any)}>
          {Translation.get('common.action.cancel')}
        </Button>,
        <Button
          key='submitall'
          onClick={() => {
            setLoading(true);
            handleUpload();
          }}
          loading={loading}
          color='primary'
          variant='outlined'
        >
          {Translation.doSth('common.action.export', 'common.all')}
        </Button>,
        <Button
          key='submit'
          type='primary'
          disabled={selected.length === 0}
          onClick={() => handleUpload(selected)}
        >
          {Translation.get('common.action.export')}
        </Button>
      ]}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form form={form}>
          <CheckboxFormItem
            name='asset_ids'
            noStyle
            checkboxGroupProps={{
              children: (
                <Grid>
                  {props.assets.map(({ id, name }) => (
                    <Col span={12} key={id}>
                      <Checkbox value={id}>{name}</Checkbox>
                    </Col>
                  ))}
                </Grid>
              ),
              onChange: setSelected,
              style: { width: '100%' }
            }}
          />
        </Form>
      </Card>
    </ModalWrapper>
  );
};
