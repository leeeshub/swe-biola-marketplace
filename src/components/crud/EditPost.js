import React from 'react';
import { Form, Input, InputNumber, Button, Upload, Select } from 'antd';
import { UploadOutlined, DollarOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const EditPost = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form submitted:', values);
  };

  const onCancel = () => {
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
        Kickstart Your Sales
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message:'Please enter a title' }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message:'Please provide a description' }]}
        >
          <TextArea rows={4} placeholder="Please provide a detailed information" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message:'Please enter a price' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            prefix={<DollarOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="Upload Image(s)"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={e => (Array.isArray(e)? e:e && e.fileList)}
        >
          <Upload name="images" listType="picture" beforeUpload={() => false} multiple>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message:'Please select a category' }]}
        >
          <Select placeholder="Select a category">
            <Option value="electronics">Clothes</Option>
            <Option value="books">Books</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ display:'flex', justifyContent:'space-between' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPost;