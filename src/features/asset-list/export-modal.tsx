import * as React from 'react';
import { Checkbox, Form, ModalProps, Col, Button } from 'antd';
import intl from 'react-intl-universal';
import { AssetRow, exportAssets } from 'asset-common';
import { useSelectedProject } from 'providers/user-profile';
import { downloadFile, getFilename } from 'utils';
import { ModalWrapper } from 'components/modalWrapper';
import { Card, CheckboxFormItem, Grid } from 'components';

export const ExportModal = (props: { assets: AssetRow[]; onSuccess: () => void } & ModalProps) => {
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
      title={intl.get('EXPORT')}
      footer={[
        <Button key='back' onClick={(e) => props.onCancel && props.onCancel(e as any)}>
          {intl.get('CANCEL')}
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
          {intl.get('EXPORT_ALL')}
        </Button>,
        <Button
          key='submit'
          type='primary'
          disabled={selected.length === 0}
          onClick={() => handleUpload(selected)}
        >
          {intl.get('EXPORT')}
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
              onChange: setSelected
            }}
          />
        </Form>
      </Card>
    </ModalWrapper>
  );
};
