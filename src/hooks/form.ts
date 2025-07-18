import { Form, FormInstance, FormItemProps, FormProps } from 'antd';

export const useFormBindingsProps = (
  props: FormProps
): Omit<FormProps, 'form'> & { form: FormInstance } => {
  const [form] = Form.useForm();
  return { ...props, form };
};

export const useFormItemBindingsProps = (props: FormItemProps): FormItemProps => {
  return props;
};
