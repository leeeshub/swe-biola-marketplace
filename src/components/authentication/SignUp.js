import React from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

const onFinish = (values) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const SignUp = () => (
  <div >
    <Title>SIGN UP</Title>

    <Form
      name="signup"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* Name Field */}
      <Form.Item name="name" label="Name"
        rules={[{ required: true, message: 'Please enter your name!' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="email" label="Email"
        rules={[{ required: true, message: 'Please enter your email!' }]}>
        <Input placeholder="e.g., john.doe@biola.edu" suffix={<Button type="primary">CONFIRM</Button>} />
      </Form.Item>

      <Form.Item name="password" label="Password"
        rules={[
          { required: true, message: 'Please enter your password' },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
            message: 'Password must be at least 8 characters, include at least 1 letter, 1 number, and 1 special character (!@#$%^&*()).',
          },
        ]}
      >
        <Input.Password suffix={<Button type="primary">CONFIRM</Button>} />
      </Form.Item>

      <Form.Item name="passwordConfirm" label="Password Confirmation"
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </Form.Item>
    </Form>

    <Text>
      Already have an account? <Link to="/login">Login</Link>
    </Text>
  </div>
);

export default SignUp;