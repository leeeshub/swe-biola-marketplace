import React from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
const { Text, Link } = Typography;

const onFinish = async (values) => {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values), // Send the form data (username and password)
    });

    const data = await response.json();

    if (response.status === 200) {
      message.success(data.message); // Show success message
      // Do something with the user data (e.g., save in state, redirect)
    } else {
      message.error(data.message); // Show error message
    }
  } catch (error) {
    message.error('An error occurred while logging in.');
  }
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Login = () => (
  <>
    <Typography.Title
        level={1}
        style={{
          margin: 0,
        }}
      >
        LOGIN
    </Typography.Title>

    <Form
      name="basic"
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="User ID"
        name="username"

        rules={[
          {
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>

    <Text>
      Don’t have an account?
      <Link> Sign Up</Link>
    </Text>
  </>
);

export default Login;